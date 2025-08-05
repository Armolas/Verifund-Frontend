import { useCallback } from 'react';
import { request } from '@stacks/connect';
import {
    fetchCallReadOnlyFunction,
    type ClarityValue,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

interface CallContractParams {
    functionName: string;
    functionArgs?: ClarityValue[];
}

const contract = 'ST385T9YTJR9TV4F6A6AGPRTZ1M7S5GB5JNDT4M8X.verifund';
const contractAddress = 'ST385T9YTJR9TV4F6A6AGPRTZ1M7S5GB5JNDT4M8X';
const contractName = 'verifund';
const network = STACKS_TESTNET;

export function useContract() {
    const callContract = useCallback(
        async ({ functionName, functionArgs }: CallContractParams) => {
            try {
                console.log('functionName', functionName);
                console.log('functionArgs', functionArgs);
                const response = await request('stx_callContract', {
                    contract,
                    functionName,
                    functionArgs,
                    network: "testnet",
                });

                console.log('Transaction ID:', response);
                return response;
            } catch (error) {
                console.error('Contract call failed:', error);
                throw error;
            }
        },
        []
    );

    const readContract = useCallback(
        async (
            functionName: string,
            functionArgs: ClarityValue[] = [],
            senderAddress = 'ST2A2DJN1S6CPYDR5T00RBNNQKV6XZDKQDFJTYW1V'
        ) => {
            try {
                const options = {
                    contractAddress,
                    contractName,
                    functionName,
                    functionArgs,
                    network,
                    senderAddress,
                };

                const result = await fetchCallReadOnlyFunction(options);
                console.log('Contract call result:', result);
                return result;
            } catch (error) {
                console.error('Contract call failed:', error);
                throw error;
            }
        },
        []
    );

    return { callContract, readContract };
}