"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateDataReader = void 0;
// import { IStateData } from "./common";
const fs = __importStar(require("fs"));
class StateDataReader {
    static readStateData(filePath) {
        console.log("Reading state data...");
        let returnData = [];
        // Read the CSV file
        const data = fs.readFileSync(filePath, 'utf8');
        // Parse the CSV data
        const parsed = data.split(',').map((line) => {
            return {
                id: Number(line.slice(0, 20)),
                sponsor: line.slice(20, 76),
                claimant: line.slice(76, 132),
                status: Number(line.slice(132, 134)),
                reward: Number(line.slice(134, 154)),
                descriptionHash: line.slice(154, 218),
                locationHash: line.slice(218, 282),
                unused: line.slice(282, line.length),
            };
        });
        returnData = parsed;
        return returnData;
    }
}
exports.StateDataReader = StateDataReader;
