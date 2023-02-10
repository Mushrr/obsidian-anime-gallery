import { App, PluginSettingTab, Setting } from 'obsidian'
import AnimeGalleryPlugin from './main'

interface AnimeGallerySettings {
	source: "anime-picture" | "konachan",
	safeMode: "on" | "off"
}

export default class AnimeGallerySettingTab extends PluginSettingTab {
	plugin: AnimeGalleryPlugin

	constructor(app: App, plugin: AnimeGalleryPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		let { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Source")
			.setDesc("Choose the source of the images")
			.addDropdown(dropdown => {
				dropdown.addOption("anime-picture", "Anime-Picture");
				dropdown.addOption("konachan", "Konachan");
				dropdown.setValue(this.plugin.settings.source);
				dropdown.onChange(async value => {
					this.plugin.settings.source = value as AnimeGallerySettings["source"];
					await this.plugin.saveSettings();
				})
			})
		new Setting(containerEl)
			.setName("Safe Mode")
			.setDesc("Enable safe mode to filter out explicit content")
			.addDropdown(dropdown => {
				dropdown.addOption("on", "on");
				dropdown.addOption("off", "off");
				dropdown.setValue(this.plugin.settings.safeMode);
				dropdown.onChange(async value => {
					this.plugin.settings.safeMode = value as AnimeGallerySettings["safeMode"];
					await this.plugin.saveSettings();
				})
			})
	}
}

export type {
	AnimeGallerySettings
}
