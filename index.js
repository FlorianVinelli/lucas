"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const sdk_1 = require("@guildxyz/sdk");
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const path = process.env.FILE_PATH;
const file = fs_1.default.readFileSync(path, 'utf8');
const wallets = JSON.parse(file);
(() => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < wallets.length; i++) {
        console.log(`Initializing wallet ${i + 1} of ${wallets.length}`);
        const privateKey = wallets[i].privateKey;
        const wallet = new ethers_1.ethers.Wallet(privateKey);
        const sign = (signableMessage) => wallet.signMessage(signableMessage);
        const res = yield sdk_1.user.join(Number(process.env.GUILD_ID), wallet.address, sign);
        if (res.success) {
            console.log(`Joined guild with address ${wallet.address}`);
        }
        else {
            console.log(`Failed to join guild with address ${wallet.address}`);
            continue
        }
        const membershipRes = yield axios_1.default.get(`https://api.guild.xyz/v1/user/membership/${wallet.address}`);
        const membership = membershipRes.data;
        const roleIds = membership[0].roleIds;
        console.log(`Total roles: ${roleIds.length}`);
        const delay = Math.floor(Math.random() * 5 + 1) * 1000;
        yield new Promise((resolve) => setTimeout(resolve, delay));
    }
}))();
