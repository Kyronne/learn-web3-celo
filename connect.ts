import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeUrl} from '@figment-celo/lib';
import {ContractKit, newKit} from '@celo/contractkit';

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {network} = req.body;
    const url = getNodeUrl(network);
    const kit = newKit(url);
    const version = await kit.web3.eth.getNodeInfo();
    res.status(200).json(version.slice(5, 11));
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
