export type Nullable<T> = T | null;

export type Account = {
	chainId: string;
	address: string;
	publicKey: string;
};

export enum IncomingMessageKind {
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
export enum OutcomingMessageKind {
	account = 'account',
	txSigned = 'txSigned',
	txConfirmation = 'txConfirmation',
	txRejection = 'txRejection'
}

export enum IframeEvent {
	ChangeColors = 'changeColors'
}

export type MessagePayload = {
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

export type Colors = {
	primary: string;
	secondary: string;
	white: string;
	error: string;
	disabled: string;
	primaryText: string;
	secondaryText: string;
	lightGrey: string;
	darkGrey: string;
	black: string;
	skeletonMain: string;
	skeletonDark: string;
	skeletonLight: string;
	skeletonBorder: string;
	tableBorder: string;
	tableStrippedBg: string;
};

export type PrefillData = {
	recipient?: string;
	referrer?: string;
	color_schema?: Partial<Colors>;
	ext_signing_chains?: number[];
	source_chain_id?: number;
	target_chain_id?: number;
	token?: string;
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

export type EventKind = IncomingMessageKind | OutcomingMessageKind;

export type Message = {
	mid: number;
	kind: EventKind;
	payload: MessagePayload[EventKind];
};

export type DestroyFn = () => void;
export type EventCallback = (e?: any) => void;
