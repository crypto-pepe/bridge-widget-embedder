# Bridge Widget Embedder

### Widget config parameters

| key                  | type                                               | note                                                                                                                                                        |
| -------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`              | string                                             | Which token should be transferred                                                                                                                           |
| `source_chain_id`    | number                                             | Transfer source chain (where transfer from)                                                                                                                 |
| `target_chain_id`    | number                                             | Transfer target chain (where transfer to)                                                                                                                   |
| `recipient`          | string                                             | Address of transfer recipient                                                                                                                               |
| `referrer`           | string                                             | Address of referrer – this address will receive cashback extracted from protocol fee as reward for the transfer. If empty, referrer will be an empty string |
| `ext_signing_chains` | string[]                                           | For which chains (sending asset chain) widget should dispatch `signTx` events and use its results as proofs                                                 |
| `color_schema`       | JSON-encoded object ([ColorSchema](#color-schema)) | Color schema to be used in the widget. If not provided, default will be used                                                                                |

#### Color Schema

All color values are presented as `#HEX`

| key              | default   | note |
| ---------------- | --------- | ---- |
| `primary`        | `#00A575` |      |
| `secondary`      | `#F7F7F7` |      |
| `white`          | `#FFFFFF` |      |
| `error`          | `#E80000` |      |
| `disabled`       | `#A1A1A1` |      |
| `primaryText`    | `#333333` |      |
| `secondaryText`  | `#717171` |      |
| `lightGrey`      | `#BFBFBF` |      |
| `darkGrey`       | `#393939` |      |
| `black`          | `#505050` |      |
| `skeletonMain`   | `#F4F4F4` |      |
| `skeletonDark`   | `#E9E9E9` |      |
| `skeletonLight`  | `#E4E4E4` |      |
| `skeletonBorder` | `#EEEEEE` |      |

Color schema example:

```json
{
	"primary": "#FFFFFF",
	"secondary": "#AAAAAA"
}
```

```javascript
let widget = new BridgeWidget();

widget.run({
	host: document.body,
	iframeUrl: 'http://localhost:8080',
	events: {
		initFinished: () => {
			alert('initFinished');
		}
	},
	width: '500',
	height: '500'
});

widget.destroy();
```

## Widget events

| Name                 | Data |
| -------------------- | ---- |
| `widgetLoaded`       | -    |
| `signTx`             | -    |
| `txBroadcasted`      | -    |
| `txConfirmed`        | -    |
| `txError`            | -    |
| `signTxTimeout`      | -    |
| `unexpectedMid`      | -    |
| `unexpectedKind`     | -    |
| `invalidPayload`     | -    |
| `unexpectedMessage`  | -    |
| `invalidPrefillData` | -    |

### Example

```javascript
widget.on('widgetLoaded', () => {
	alert('widget loaded');
});
```

```typescript
type Message = {
  mid: number,
  kind: IncomingMessageKind | OutgoingMessageKind,
  payload: MessagePayload[MessageKind]
}

IncomingMessageKind {
	getAccount = 'getAccount',
	signTx = 'signTx',
	txBroadcasted = 'txBroadcasted',
	txConfirmed = 'txConfirmed',
	txError = 'txError',
	signTxTimeout = 'signTxTimeout',
	unexpectedMid = 'unexpectedMid',
	unexpectedKind = 'unexpectedKind',
	invalidPayload = 'invalidPayload',
	unexpectedMessage = 'unexpectedMessage',
	invalidPrefillData = 'invalidPrefillData',
	widgetLoaded = 'widgetLoaded'
}

// Widget will expect
OutcomingMessageKind {
	account = 'account',
	txSigned = 'txSigned',
	txConfirmation = 'txConfirmation',
	txRejection = 'txRejection'
}

MessagePayload = {
	[IncomingMessageKind.getAccount]: null;
	[IncomingMessageKind.signTx]: {
		tx: any;
	};
	[IncomingMessageKind.txBroadcasted]: {
		tx_id: string;
	};
	[IncomingMessageKind.txConfirmed]: {
		tx_id: string;
	};
	[IncomingMessageKind.txError]: {
		reason: string;
	};
	[IncomingMessageKind.signTxTimeout]: {
		reason: string;
	};
	[IncomingMessageKind.unexpectedMid]: {
		mid: number;
		previous_mid: number;
	};
	[IncomingMessageKind.unexpectedKind]: {
		kind: string;
		valid_kinds: string[];
	};
	[IncomingMessageKind.invalidPayload]: {
		reason: string;
	};
	[IncomingMessageKind.unexpectedMessage]: {
		reason: string;
	};
	[IncomingMessageKind.invalidPrefillData]: {
		reason: string;
	};
	[IncomingMessageKind.widgetLoaded]: undefined;
	[OutcomingMessageKind.account]: {
		account: Account;
	};
	[OutcomingMessageKind.txSigned]: {
		tx: any;
	};
	[OutcomingMessageKind.txConfirmation]: {
		proofs: string[];
	};
	[OutcomingMessageKind.txRejection]: {
		reason: string;
	};
};
```
