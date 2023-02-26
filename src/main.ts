import { AnimeGalleryModal } from './modal';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import AnimeGallerySettingTab, { AnimeGallerySettings } from './settings';

// Remember to rename these classes and interfaces!


const DEFAULT_SETTINGS: AnimeGallerySettings = {
	source: 'anime-picture',
	safeMode: "on"
}

export default class AnimeGalleryPlugin extends Plugin {
	settings: AnimeGallerySettings;
	clipboard: Clipboard

	async onload() {
		await this.loadSettings();
		this.clipboard = navigator.clipboard;
		this.addCommand({
			id: "open-anime-gallery",
			name: "Open anime gallery",
			callback: () => {
				new AnimeGalleryModal(this.app, this).open();
			}
		})

        this.addSettingTab(new AnimeGallerySettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
