// import { IStateData } from "./common";
import * as fs from 'fs';
import { IStateData } from './common';

export class StateDataReader {
  static readStateData(filePath: string): IStateData[] {
    console.log("Reading state data...");

    let returnData: IStateData[] = []

    // Read the CSV file
    const data = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV data
    const parsed: IStateData[] = data.split(',').map((line) => {
      return {
        id: Number(line.slice(0, 20)),
        sponsor: line.slice(20, 76),
        claimant: line.slice(76, 132),
        status: Number(line.slice(132, 134)),
        reward: Number(line.slice(134, 154)),
        descriptionHash: line.slice(154, 218),
        locationHash: line.slice(218, 282),
        unused: line.slice(282, line.length),
      }
    });

    returnData = parsed;

    return returnData;
  }
}
