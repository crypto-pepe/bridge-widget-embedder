import { BridgeWidget, IncomingMessageKind, OutgoingMessageKind } from '../src';

const widget = new BridgeWidget();

widget.on(IncomingMessageKind.GetAccount, (m) => {
	widget.sendMessage({
		mid: m.mid,
		kind: OutgoingMessageKind.Account,
		payload: {
			account: {
				chainId: 'T',
				address: 'ADDRESS',
				publicKey: 'PUBLIC-KEY'
			}
		}
	});
});

widget.run({
	name: 'bridge',
	iframeUrl: 'https://bridge.pepe.team/iframe',
	host: document.body,
	token: 'ETH',
	source_chain_id: 1,
	target_chain_id: 2,
	ext_signing_chains: [1],
	recipient: 'RECIPIENT',
	referrer: 'REFERRER'
});

// destroy widget when transfer is done
widget.destroy();
