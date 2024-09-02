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
exports.StateDataWriter = void 0;
const fs = __importStar(require("fs"));
class StateDataWriter {
    static writeStateData(data, filePath) {
        console.log("Writing state data...");
        // Prepare the CSV data
        const formattedData = data.map((item) => {
            const paddedId = item.id.toString().padStart(20, '0');
            const paddedReward = item.reward.toString().padStart(20, '0');
            const paddedStatus = item.status.toString().padStart(2, '0');
            return `${paddedId}${item.sponsor}${item.claimant}${paddedStatus}${paddedReward}${item.descriptionHash}${item.locationHash}${item.unused}`;
        });
        fs.writeFileSync(filePath, formattedData.join(','));
        return true;
    }
}
exports.StateDataWriter = StateDataWriter;
