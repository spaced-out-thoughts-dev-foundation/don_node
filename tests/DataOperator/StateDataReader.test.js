"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateDataReader_1 = require("../../src/DataOperator/StateDataOperator/StateDataReader");
const StateDataWriter_1 = require("../../src/DataOperator/StateDataOperator/StateDataWriter");
test('converts from state to file and back', () => {
    const originalState = [
        {
            id: 1,
            reward: 100,
            sponsor: 'GBHVSZRQ5NNYNTJDMZAC7KIF23I4PPGSLO2SPEYQCTVMR4US77B7E3CW',
            claimant: 'GDDXU443NXH7VKX3G3YHKZX3K7NKSSZICDXAZL3JA2TPETLL4YH5Q4WF',
            status: 0,
            descriptionHash: '1a45e3be48f64911d372bcccd9c4dbe7dca9dab716603e4e80c2e55f701bde7a',
            locationHash: '7f707fbf9469f347b97496c5c990bc8bc8065984b471a90c06906328f3bb958e',
            unused: "".padStart(230, '0')
        },
        {
            id: 102039,
            reward: 2345102,
            sponsor: 'GAWH73YYKQLNFWOUISTI5WBUWZARR5EY3GM22R5TEYED7ILLVYQE6U2I',
            claimant: 'GA7AQNE6XHJ65DT5UQCSGZ6KWZB5NQSZXT2F6AJ3JIIXO25X7TCD6AVV',
            status: 14,
            descriptionHash: '3933cb5f76fcf16446cc1f4fceece65537ee2b8bab6685d9e7a34fbc90fc6e6f',
            locationHash: '7f9c3cdcb0e1742501789b34b44bb699c92f872f6d674dcf261c4f4a75120c58',
            unused: "".padStart(230, '0')
        },
        {
            id: 1203,
            reward: 2923920,
            sponsor: 'GCZXDWLQRJN6QL6ZNYL3RKRKRIAXZAGEG33V62YHOWJ5ENC6JS2KVXUX',
            claimant: 'GBBHA7MZHJRN36JRCYLVHTWPDGSCU52CILHOIBRF74IWTER6NJEU3YV7',
            status: 0,
            descriptionHash: '2b262cc0b74594ed660fab4adeb6062894d533100d839e9e3124b5eb4faa8c5c',
            locationHash: '8eda126265c50cc08d6d80177e1a7b9949906035ac33eda5b0ed4a561f166771',
            unused: "".padStart(230, '0')
        }
    ];
    const filePath = 'state-data.csv';
    StateDataWriter_1.StateDataWriter.writeStateData(originalState, filePath);
    const actualState = StateDataReader_1.StateDataReader.readStateData(filePath);
    expect(actualState).toEqual(originalState);
});
