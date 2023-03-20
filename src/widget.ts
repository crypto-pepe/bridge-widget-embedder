import EventBus from 'js-event-bus';
import {
	CreateIframeArgs,
	Nullable,
	PrefillData,
	WidgetArgs,
	IframeEvent,
	Colors,
	EventKind,
	Message
} from './types';

export class BridgeWidget {
	host: Nullable<HTMLElement> = null;
	iframe: Nullable<Window> = null;
	iframeName: Nullable<string> = null;
	iframeUrl: Nullable<string> = null;
	eventBus: EventBus;

	constructor() {
		this.eventBus = new EventBus();
	}

	on(eventKind: EventKind, callback: (message?: Message) => void) {
		this.eventBus.on(eventKind, callback);
	}

	prefill(prefillData: PrefillData): string {
		const data: Partial<Record<keyof PrefillData, object | string | number>> = {
			...prefillData
		};

		if (prefillData.ext_signing_chains) {
			data.ext_signing_chains = prefillData.ext_signing_chains?.join(',');
		}

		const prefillEntries = Object.entries(data);
		const queryparams = prefillEntries
			.filter(([, value]) => value)
			.map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
			.join('&');
		if (queryparams.length > 0) {
			return `?${queryparams}`;
		}
		return '';
	}

	createIframe({ iframeUrl, width, height, name }: CreateIframeArgs): HTMLIFrameElement {
		const el = document.createElement('iframe');
		el.setAttribute('name', name);
		el.setAttribute('src', iframeUrl);
		el.setAttribute('width', width || '100%');
		el.setAttribute('height', height || '100%');
		el.setAttribute('frameborder', '0');
		el.setAttribute('style', 'min-width:320px;min-height:320px;display:block;');
		return el;
	}

	setColorScheme(colors: Colors) {
		if (this.iframe) {
			this.iframe.postMessage({
				name: IframeEvent.ChangeColors,
				data: { ...colors }
			});
		} else {
			throw Error('Widget is not loaded');
		}
	}

	run(args: WidgetArgs) {
		const {
			host,
			name,
			iframeUrl,
			width = '100%',
			height = '100%',
			color_schema,
			recipient,
			referrer,
			ext_signing_chains,
			source_chain_id,
			target_chain_id,
			token
		} = args;

		this.host = host;
		this.iframeUrl = iframeUrl;
		this.iframeName = name;

		const queryParams = this.prefill({
			recipient,
			referrer,
			ext_signing_chains,
			color_schema,
			source_chain_id,
			target_chain_id,
			token
		});

		const iframe = this.createIframe({
			iframeUrl: `${iframeUrl}${queryParams}`,
			width,
			height,
			name
		});

		host.append(iframe);
		this.iframe = (window.frames as Record<string, any>)[this.iframeName];
		window.addEventListener('message', this.onMessageReceive);
	}

	onMessageReceive = ({ data }: MessageEvent<Message>) => {
		this.eventBus.emit(data.kind, null, data);
	};

	sendMessage(message: Message) {
		if (this.iframe && this.iframeUrl) {
			this.iframe.postMessage(message, this.iframeUrl);
		}
	}

	destroy() {
		this.eventBus.detachAll();
	}
}
