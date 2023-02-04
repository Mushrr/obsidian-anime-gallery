import { AnimeGalleryModal } from './modal';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async load(): Promise<void> {
		this.addCommand({
			id: "anime-gallery",
			name: "Anime Gallery",
			callback: () => {
				new AnimeGalleryModal(this.app).open();
			}
		})
	}
}
