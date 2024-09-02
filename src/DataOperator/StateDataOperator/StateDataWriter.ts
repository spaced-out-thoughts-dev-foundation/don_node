import { IStateData } from "./common";
import * as fs from 'fs';

export class StateDataWriter {
  static writeStateData(data: IStateData[], filePath: string): boolean {
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