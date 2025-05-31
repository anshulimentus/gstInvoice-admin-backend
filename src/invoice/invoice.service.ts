import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

import Web3 from 'web3';
// import * as PDFDocument from 'pdfkit';
import chalk from 'chalk';

@Injectable()
export class InvoiceService {
    private web3: Web3;
    private contract: any;
    private account: string;
    private contractAddress = "0x95ff09D61bD1cF40FD7ac48Da23eE3085E80A09f";
    private privateKey = process.env.PRIVATE_KEY || "85007bbab10feafda61c2771f47c51e2062f99ecc4489b9205dc47c92518e5e8";
    private providerURL = process.env.PROVIDER_URL || 'https://sepolia.infura.io/v3/eadd0f87d61c43a5a67587f4c83156a1';
    private ownerAddress = process.env.OWNER_ADDRESS || "0x8dDf7814F14035aa34e867E6BB040CfDA1D3B4Ac";

    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>
    ) {
        // Initialize Web3 connection
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL));
        this.contract = new this.web3.eth.Contract([
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "gstNumber",
                        "type": "string"
                    }
                ],
                "name": "CustomerAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    }
                ],
                "name": "CustomerDeleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "gstNumber",
                        "type": "string"
                    }
                ],
                "name": "CustomerUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "invoiceNumber",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "grandTotal",
                        "type": "uint256"
                    }
                ],
                "name": "InvoiceCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "invoiceNumber",
                        "type": "string"
                    }
                ],
                "name": "InvoiceDeleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "invoiceNumber",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "grandTotal",
                        "type": "uint256"
                    }
                ],
                "name": "InvoiceUpdated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "productID",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "productName",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "ProductAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "productID",
                        "type": "uint256"
                    }
                ],
                "name": "ProductDeleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "productID",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "productName",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "ProductUpdated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_gstNumber",
                        "type": "string"
                    }
                ],
                "name": "addCustomer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    }
                ],
                "name": "addProduct",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_invoiceNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_grandTotal",
                        "type": "uint256"
                    }
                ],
                "name": "createInvoice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "name": "customers",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "gstNumber",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_id",
                        "type": "string"
                    }
                ],
                "name": "deleteCustomer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_invoiceNumber",
                        "type": "string"
                    }
                ],
                "name": "deleteInvoice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "deleteProduct",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "name": "invoices",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "invoiceNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "grandTotal",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "nextCustomerId",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "products",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "productID",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "productName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalInvoices",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalProducts",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_gstNumber",
                        "type": "string"
                    }
                ],
                "name": "updateCustomer",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_invoiceNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_grandTotal",
                        "type": "uint256"
                    }
                ],
                "name": "updateInvoice",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_price",
                        "type": "uint256"
                    }
                ],
                "name": "updateProduct",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], this.contractAddress);

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







    async findAll(): Promise<Invoice[]> {
        return this.invoiceRepository.find();
      }
      
    async findOne(id: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceId: id },
            relations: ['seller', 'buyer'],
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }

    async findByInvoiceNo(invoiceNo: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { invoiceNo },
            relations: ['seller', 'buyer'],
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }

    // Blockchain interaction me }
    


 



    async getTotalInvoicesFromBlockchain(): Promise<number> {
        try {
            const total = await this.contract.methods.totalInvoices().call();
            return Number(total);
        } catch (error) {
            console.error('Failed to get total invoices from blockchain', error);
            throw error;
        }
    }

}