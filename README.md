# Bridge Widget Embedder

### Widget config parameters

| Key                  | Type                                               | Note                                                                                                                                                        |
| -------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `host`               | `HTMLElement`                                      | DOM element where widget should be placed                                                                                                                   |
| `iframeUrl`          | `string`                                           | URL for origin iframe URL (https://bridge.pepe.team/iframe)                                                                                                 |
| `token`              | `string`                                           | Which token should be transferred. It should be token symbol, e.g. `ETH`                                                                                    |
| `source_chain_id`    | `number`                                           | Transfer source chain (where transfer from). It should be bridge chain id, e.g. `1`, `2` for mainnet or `10001`, `10002` for testnet                        |
| `target_chain_id`    | `number`                                           | Transfer target chain (where transfer to). It should be bridge chain id, e.g. `1`, `2` for mainnet or `10001`, `10002` for testnet                          |
| `recipient`          | `string`                                           | Address of transfer recipient                                                                                                                               |
| `amount`             | `number`                                           | Amount to be prefilled in the form                                                                                                                          |
| `referrer`           | `string`                                           | Address of referrer – this address will receive cashback extracted from protocol fee as reward for the transfer. If empty, referrer will be an empty string |
| `ext_signing_chains` | `string`[]                                         | For which chains (sending asset chain) widget should dispatch `signTx` events and use its results as proofs                                                 |
| `color_schema`       | JSON-encoded object ([ColorSchema](#color-schema)) | Color schema to be used in the widget. If not provided, default will be used                                                                                |

#### Widget tabs:

| Name       |
| ---------- |
| `transfer` |
| `history`  |

#### Color Schema

All color values are presented as `#HEX`

| key                  | default |
| -------------------- | ------- |
| `bg-primary`         | #00A575 |
| `bg-secondary`       | #FFFFFF |
| `bg-tertiary`        | #F7F7F7 |
| `border-primary`     | #00A575 |
| `border-secondary`   | #FFFFFF |
| `border-error`       | #E80000 |
| `border-disabled`    | #BFBFBF |
| `text-primary`       | #333333 |
| `text-secondary`     | #717171 |
| `text-tertiary`      | #BFBFBF |
| `text-error`         | #E80000 |
| `text-disabled`      | #BFBFBF |
| `skeleton-primary`   | #F4F4F4 |
| `skeleton-secondary` | #E9E9E9 |
| `skeleton-tertiary`  | #E4E4E4 |
| `skeleton-shimer`    | #FFFFFF |
| `skeleton-border`    | #EEEEEE |
| `tab-btn-primary`    | #00A575 |
| `tab-btn-secondary`  | #FFFFFF |
| `input-primary`      | #333333 |
| `input-secondary`    | #FFFFFF |
| `input-error`        | #E80000 |
| `input-disabled`     | #BFBFBF |
| `fee-low`            | #F5AC37 |
| `fee-normal`         | #00A575 |
| `fee-high`           | #E80000 |
| `fee-custom`         | #717171 |

Color schema example:

```json
{
	"bg-primary": "#FFFFFF",
	"bg-secondary": "#AAAAAA"
}
```

### Methods

#### `run`

Start the widget

| Arg      | Type         | Note                                                   |
| -------- | ------------ | ------------------------------------------------------ |
| `config` | `WidgetArgs` | [Widget config paramenters](#widget-config-parameters) |

```typescript
widget.run({
	iframeUrl: 'https://bridge.pepe.team/iframe',
	host: document.body,
	token: 'ETH'
});
```

#### `on`

Listen for widget incomming messages (widget interaction)

| Arg         | Type                                        | Note                     |
| ----------- | ------------------------------------------- | ------------------------ |
| `eventKind` | `IncomingMessageKind`                       | Kind of incoming message |
| `callback`  | `(msg: Message<IncomingMessageKind>): void` | Message handler          |

```typescript
widget.on(IncomingMessageKind.TxBroadcasted, (tx_id) => {
	console.log('Tx broadcasted', tx_id);
});
```

#### `sendMessage`

Send message to the widget (widget interaction)

| Arg       | Type                           | Note                         |
| --------- | ------------------------------ | ---------------------------- |
| `message` | `Message<OutgoingMessageKind>` | Message to be send to widget |

```typescript
const msg = {
	mid: 1,
	kind: OutgoingMessageKind.TxRejection,
	payload: {
		reason: 'User rejection'
	}
};
widget.sendMessage(msg);
```

#### `setAmount`

Set form field `amount` to provided value

| Arg      | Type                                | Note                          |
| -------- | ----------------------------------- | ----------------------------- |
| `amount` | `BigNumber` \| `number` \| `string` | New form field `amount` value |

```typescript
widget.setAmount(1);
```

#### `setColorSchema`

| Arg      | Type              | Note                          |
| -------- | ----------------- | ----------------------------- |
| `colors` | `Partial<Colors>` | New form colors to be applied |

```typescript
const colors = {
	'bg-primary': '#000000',
	'text-primary': '#FFFFFF'
};
widget.setColorSchema(colors);
```

## Widget usage example

```typescript
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
	iframeUrl: 'https://bridge.pepe.team/iframe',
	host: document.body,
	token: 'ETH',
	source_chain_id: 1,
	target_chain_id: 2,
	ext_signing_chains: [1],
	recipient: 'RECIPIENT',
	amount: 100,
	referrer: 'REFERRER',
	color_schema: {
		'bg-primary': '#000000',
		'text-primary': '#FFFFFF'
	}
});

// destroy widget when transfer is done
widget.destroy();
```

## Widget incoming events

| Name                 |
| -------------------- |
| `widgetLoaded`       |
| `getAccount`         |
| `getAccountTimeout`  |
| `signTx`             |
| `txBroadcasted`      |
| `txConfirmed`        |
| `txError`            |
| `signTxTimeout`      |
| `unexpectedMid`      |
| `unexpectedKind`     |
| `invalidPayload`     |
| `unexpectedMessage`  |
| `invalidPrefillData` |
