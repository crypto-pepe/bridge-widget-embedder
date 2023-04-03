import type { BigNumber } from '@waves/bignumber';
export type Nullable<T> = T | null;

export type Account = {
	chainId: string;
	address: string;
	publicKey: string;
};

// Widget will send
export enum IncomingMessageKind {
	WidgetLoaded = 'widgetLoaded',
	GetAccount = 'getAccount',
	SignTx = 'signTx',
	TxBroadcasted = 'txBroadcasted',
	TxConfirmed = 'txConfirmed',
	TxError = 'txError',
	SignTxTimeout = 'signTxTimeout',
	UnexpectedMid = 'unexpectedMid',
	UnexpectedKind = 'unexpectedKind',
	InvalidPayload = 'invalidPayload',
	UnexpectedMessage = 'unexpectedMessage',
	InvalidPrefillData = 'invalidPrefillData'
}

// Widget tabs
export enum WidgetTab {
	Transfer = 'transfer',
	History = 'history'
}

// Widget expects to handle
export enum OutgoingMessageKind {
	Account = 'account',
	AccountRejection = 'accountRejection',
	TxConfirmation = 'txConfirmation',
	TxRejection = 'txRejection',
	SetColorSchema = 'setColorSchema',
	SetAmount = 'setAmount'
}

export type MessagePayload = {
	[IncomingMessageKind.GetAccount]: null;
	[IncomingMessageKind.SignTx]: {
		tx: any;
	};
	[IncomingMessageKind.TxBroadcasted]: {
		tx_id: string;
	};
	[IncomingMessageKind.TxConfirmed]: {
		tx_id: string;
	};
	[IncomingMessageKind.TxError]: {
		reason: string;
	};
	[IncomingMessageKind.SignTxTimeout]: {
		reason: string;
	};
	[IncomingMessageKind.UnexpectedMid]: {
		mid: number;
		previous_mid: number;
	};
	[IncomingMessageKind.UnexpectedKind]: {
		kind: string;
		valid_kinds: string[];
	};
	[IncomingMessageKind.InvalidPayload]: {
		reason: string;
	};
	[IncomingMessageKind.UnexpectedMessage]: {
		reason: string;
	};
	[IncomingMessageKind.InvalidPrefillData]: {
		reason: string;
	};
	[IncomingMessageKind.WidgetLoaded]: null;
	[OutgoingMessageKind.Account]: {
		account: Account;
	};
	[OutgoingMessageKind.AccountRejection]: {
		reason: string;
	};
	[OutgoingMessageKind.TxConfirmation]: {
		proofs: string[];
	};
	[OutgoingMessageKind.TxRejection]: {
		reason: string;
	};
	[OutgoingMessageKind.SetColorSchema]: Partial<Colors>;
	[OutgoingMessageKind.SetAmount]: BigNumber | number | string;
};

export type Colors = {
	// group background:
	'bg-primary': string;
	'bg-secondary': string;
	'bg-tertiary': string;

	// group border:
	'border-primary': string;
	'border-secondary': string;
	'border-error': string;
	'border-disabled': string;

	// group text:
	'text-primary': string;
	'text-secondary': string;
	'text-tertiary': string;

	// group skeleton
	'skeleton-primary': string;
	'skeleton-secondary': string;
	'skeleton-tertiary': string;
	'skeleton-shimer': string;
	'skeleton-border': string;

	// group tab:
	'tab-btn-primary': string;
	'tab-btn-secondary': string;

	// group fee:
	'fee-low': string;
	'fee-normal': string;
	'fee-high': string;
	'fee-custom': string;
};

export type PrefillData = {
	recipient?: string;
	referrer?: string;
	color_schema?: Partial<Colors>;
	ext_signing_chains?: number[];
	source_chain_id?: number;
	target_chain_id?: number;
	token?: string;
	amount?: BigNumber | string | number;
	activeTab?: WidgetTab;
};

export type WidgetArgs = {
	name: string;
	iframeUrl: string;
	host: HTMLElement;
	width?: string;
	height?: string;
} & PrefillData;

export type CreateIframeArgs = {
	width: string;
	height: string;
	iframeUrl: string;
	name: string;
};

export type EventKind = IncomingMessageKind | OutgoingMessageKind;

export type Message<E extends EventKind, P extends MessagePayload[E] = MessagePayload[E]> = {
	mid: number;
	kind: E;
	payload: P;
};
