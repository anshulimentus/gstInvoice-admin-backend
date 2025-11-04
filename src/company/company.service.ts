import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import Web3 from "web3";
import chalk from "chalk";
import { CONTRACT_ABI } from "../abi/contract.abi";
import { UsersService } from "../users/users.service";


@Injectable()
export class CompanyService {
    private web3: Web3;
    private contract: any;
    private account: string;
    private contractAddress: string;
    private privateKey: string;
    private providerURL: string;
    private ownerAddress: string;

    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        private readonly usersService: UsersService,
    ) {
            // Validate environment variables
    if (!process.env.PROVIDER_URL) {
        throw new Error('PROVIDER_URL is not set in environment variables');
      }
      if (!process.env.CONTRACT_ADDRESS) {
        throw new Error('CONTRACT_ADDRESS is not set in environment variables');
      }
      if (!process.env.PRIVATE_KEY) {
        throw new Error('PRIVATE_KEY is not set in environment variables');
      }
      if (!process.env.OWNER_ADDRESS) {
        throw new Error('OWNER_ADDRESS is not set in environment variables');
      }
  
      this.providerURL = process.env.PROVIDER_URL;
      this.contractAddress = process.env.CONTRACT_ADDRESS;
      this.privateKey = process.env.PRIVATE_KEY;
      this.ownerAddress = process.env.OWNER_ADDRESS;

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL));
        this.contract = new this.web3.eth.Contract(CONTRACT_ABI, this.contractAddress);

        const sanitizedPrivateKey = this.privateKey.startsWith("0x")
            ? this.privateKey
            : "0x" + this.privateKey;

        try {
            const account = this.web3.eth.accounts.privateKeyToAccount(sanitizedPrivateKey);
            this.account = account.address;
            this.web3.eth.accounts.wallet.add(account);
            this.web3.eth.defaultAccount = account.address;
            console.log(chalk.green("✅ Web3 account initialized:", this.account));
        } catch (err) {
            console.error(chalk.red("❌ Failed to initialize Web3 account:"), err);
            throw new InternalServerErrorException("Failed to initialize Web3 account");
        }
    }


    private async sendTransaction(encodedABI: string, userWalletAddress?: string): Promise<any> {
        // Use user's wallet address if provided, otherwise use default owner address
        const signerAddress = userWalletAddress || this.ownerAddress;
        const nonce = await this.web3.eth.getTransactionCount(signerAddress, "latest");

        const tx = {
            to: this.contractAddress,
            data: encodedABI,
            gas: 500000,
            gasPrice: this.web3.utils.toWei("50", "gwei"),
            nonce: nonce,
            // type: 0, // Optional: only if you specifically want to use legacy type
        };

        console.log(chalk.blue(`🔑 Signing transaction with wallet: ${signerAddress}`));

        // Sign transaction using private key
        const signedTx = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
        console.log("Signed Transaction:", signedTx);

        if (!signedTx.rawTransaction) {
            throw new InternalServerErrorException("Failed to sign the transaction");
        }

        console.log("📤 Sending signed transaction to the network...", signedTx.rawTransaction);

        // Send the signed transaction
        return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }

    async create(createCompanyDto: CreateCompanyDto, logoUrl: string, userWalletAddress?: string): Promise<Company> {
        const { companyName, gstNumber, legalRepresentative, addressline1, addressline2, district } = createCompanyDto;

        if (!companyName || !gstNumber || !legalRepresentative) {
            throw new BadRequestException("Company details are incomplete");
        }

        console.log("📌 CompanyService: Starting company creation");
        console.log("➡️ Payload:", createCompanyDto);

        const address = `${addressline1}, ${addressline2 || ''}, ${district || ''}`.trim();

        const existingCompany = await this.companyRepository.findOne({ where: { companyName } });
        if (existingCompany) {
            throw new BadRequestException(`Company with name "${companyName}" already exists`);
        }

        const encodedABI = this.contract.methods
            .addCompany(companyName, gstNumber, legalRepresentative)
            .encodeABI();

        console.log("📤 Sending transaction to blockchain...");

        const receipt = await this.sendTransaction(encodedABI);

        if (!receipt || !receipt.status) {
            console.error("❌ Blockchain transaction failed");
            throw new InternalServerErrorException("Transaction failed on-chain");
        }

        console.log("✅ Transaction confirmed!");
        console.log("🔗 Tx Hash:", receipt.transactionHash);

        // Extract image_id from logoUrl (assuming format: /images/{uuid})
        const imageId = logoUrl.split('/').pop() || '';

        // Construct full backend URL for image loading
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
        const fullImageUrl = logoUrl.startsWith('http')
            ? logoUrl
            : `${baseUrl}${logoUrl}`;

        const newCompany = this.companyRepository.create({
            ...createCompanyDto,
            image_url: fullImageUrl, // Save full backend URL for image loading
            image_id: imageId,
            address,
            transactionHash: receipt.transactionHash,
        });

        const savedCompany = await this.companyRepository.save(newCompany);

        console.log(chalk.bgGrey("✅ Company saved to database with ID:", savedCompany.id));

        return savedCompany;
    }


    // Get all companies
    async findAll(): Promise<Company[]> {
        return this.companyRepository.find();
    }


    // Get a company by ID
    async findOne(id: number): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }


    // Update a company
    async update(id: number, updateCompanyDto: UpdateCompanyDto, userWalletAddress?: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        // Update the company in the database
        Object.assign(company, updateCompanyDto);
        const updatedCompany = await this.companyRepository.save(company);

        // Call the smart contract to update the company
        const encodedABI = this.contract.methods
            .updateCompany(company.legalRepresentative, updateCompanyDto.companyName || company.companyName, updateCompanyDto.gstNumber || company.gstNumber)
            .encodeABI();

        const receipt = await this.sendTransaction(encodedABI);

        if (!receipt || !receipt.status) {
            console.error("❌ Blockchain transaction failed");
            throw new InternalServerErrorException("Transaction failed on-chain");
        }

        // Save the transaction hash to the database
        updatedCompany.transactionHash = receipt.transactionHash;
        await this.companyRepository.save(updatedCompany);

        console.log(chalk.bgGrey("✅ Company updated in database with ID:", updatedCompany.id));
        return updatedCompany;
    }


    // Delete a company
    async remove(id: number, userWalletAddress?: string): Promise<void> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        // Call the smart contract to delete the company
        const encodedABI = this.contract.methods
            .deleteCompany(company.legalRepresentative)
            .encodeABI();

        const receipt = await this.sendTransaction(encodedABI);

        if (!receipt || !receipt.status) {
            console.error("❌ Blockchain transaction failed");
            throw new InternalServerErrorException("Transaction failed on-chain");
        }

        // Delete from database
        const result = await this.companyRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        console.log(chalk.bgGrey("✅ Company deleted from database with ID:", id));
    }

    // Total companies
    async getTotalCompanies(): Promise<number> {
        return this.companyRepository.count();
    }
}
