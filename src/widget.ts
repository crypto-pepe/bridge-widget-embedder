import BigNumber from '@waves/bignumber';
import EventBus from 'js-event-bus';
import {
	CreateIframeArgs,
	Nullable,
	PrefillData,
	WidgetArgs,
	Colors,
	Message,
	IncomingMessageKind,
	OutgoingMessageKind
} from './types';

export class BridgeWidget {
	private host: Nullable<HTMLElement> = null;
	private iframe: Nullable<Window> = null;
	private iframeName: Nullable<string> = null;
	private iframeUrl: Nullable<string> = null;
	private eventBus: EventBus;

	private lastMessageId = 0;

	constructor() {
		this.eventBus = new EventBus();
	}

	on = <E extends IncomingMessageKind>(eventKind: E, callback: (message: Message<E>) => void) => {
		this.eventBus.on(eventKind, callback);
	};

	sendMessage = <K extends OutgoingMessageKind>(message: Message<K>) => {
		if (this.iframe && this.iframeUrl) {
			this.iframe.postMessage(message, this.iframeUrl);
		} else {
			throw Error('Widget is not loaded');
		}
	};

	setColorScheme = (colors: Partial<Colors>) => {
		const mid = ++this.lastMessageId;
		this.sendMessage({
			mid,
			kind: OutgoingMessageKind.SetColorSchema,
			payload: colors
		});
	};

	setAmount = (amount: BigNumber | number | string) => {
		const mid = ++this.lastMessageId;
		this.sendMessage({
			mid,
			kind: OutgoingMessageKind.SetAmount,
			payload: amount.toString()
		});
	};

	run = (args: WidgetArgs) => {
		const {
			host,
			name,
			iframeUrl,
			width = '100%',
			height = '100%',
			color_schema,
			recipient,
			referrer,
			token,
			ext_signing_chains,
			source_chain_id,
			target_chain_id,
			token_bridge_id,
			amount,
			activeTab
		} = args;

		this.host = host;
		this.iframeUrl = iframeUrl;
		this.iframeName = name;

		const prefillData: Record<string, unknown> = {
			recipient,
			referrer,
			ext_signing_chains,
			color_schema,
			source_chain_id,
			target_chain_id,
			amount,
			activeTab
		};

		if (typeof token === 'string' && typeof token_bridge_id === 'undefined') {
			prefillData['token'] = token;
		} else if (typeof token === 'undefined' && typeof token_bridge_id === 'string') {
			prefillData['token_bridge_id'] = token_bridge_id;
		}

		const queryParams = this.prefill(prefillData);

		const iframe = this.createIframe({
			iframeUrl: `${iframeUrl}${queryParams}`,
			width,
			height,
			name
		});

		this.host.append(iframe);
		this.iframe = (window.frames as Record<string, any>)[this.iframeName];

		window.addEventListener('message', this.handleMessage);
	};

	destroy = () => {
		this.eventBus.detachAll();
	};

	private prefill(prefillData: PrefillData): string {
		const data = {
			...prefillData
		};

		const prefillEntries = Object.entries(data);
		const queryparams = prefillEntries
			.filter(([, value]) => value)
			.reduce<[string, string][]>((acc, [key, value]) => {
				if (BigNumber.isBigNumber(value)) {
					acc.push([key, value.toString()]);
				} else if (Array.isArray(value)) {
					value.forEach((v) => {
						acc.push([`${key}[]`, v.toString()]);
					});
				} else if (typeof value === 'object') {
					acc.push([key, encodeURIComponent(JSON.stringify(value))]);
				} else if (typeof value !== 'undefined') {
					acc.push([key, value.toString()]);
				}
				return acc;
			}, [])
			.map((kv) => kv.join('='))
			.join('&');
		if (queryparams.length > 0) {
			return `?${queryparams}`;
		}
		return '';
	}

	private createIframe({ iframeUrl, width, height, name }: CreateIframeArgs): HTMLIFrameElement {
		const el = document.createElement('iframe');
		el.setAttribute('name', name);
		el.setAttribute('src', iframeUrl);
		el.setAttribute('width', width || '100%');
		el.setAttribute('height', height || '100%');
		el.setAttribute('frameborder', '0');
		el.setAttribute('style', 'min-width:320px;min-height:320px;display:block;');
		el.setAttribute('allow', 'clipboard-write');
		return el;
	}

	private handleMessage = <K extends IncomingMessageKind>({ data }: MessageEvent<Message<K>>) => {
		this.eventBus.emit(data.kind, null, data);
	};
}
