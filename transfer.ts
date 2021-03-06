import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeUrl} from '@figment-celo/lib';
import {newKit} from '@celo/contractkit';

export default async function transfer(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {secret, amount, recipient, address, network} = req.body;
    const url = getNodeUrl(network);
    const kit = newKit(url);

    // Restore account using your secret
    kit.addAccount(secret);
    // Access CELO contract wrapper
    const celoToken = await kit.contracts.getGoldToken();
    // Build the transaction and send
    const celotx = await celoToken
      .transfer(recipient, amount)
      .send({from: address});
    // Wait for confirmation of the transaction
    const celoReceipt = await celotx.waitReceipt();

    res.status(200).json(celoReceipt.transactionHash);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
