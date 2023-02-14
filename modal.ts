// Modal
import { App, debounce, Modal, MarkdownView, Notice } from 'obsidian'
import cgControl from './cgurls';
import AnimeGalleryPlugin from './main';

export class AnimeGalleryModal extends Modal {
	// tags
	tags: string;
	plugin: AnimeGalleryPlugin

	constructor(app: App, plugin: AnimeGalleryPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		let isSearch = true;

		let { contentEl } = this;
		const inputArea = contentEl.createEl('input', {
			placeholder: "please input some tags: blue_eyes,empty_background"
		})
		inputArea.classList.add("input-area")
		const div = contentEl.createEl('div')
		div.classList.add("cg-img-container")
		div.empty();
		const search = debounce(() => {
			new Notice("Ciallo～(∠·ω< )⌒: start searching~");
			if (isSearch) {
				div.empty();
			}
			const tags = cgControl[this.plugin.settings.source].metaData.tags || [];
			const page = cgControl[this.plugin.settings.source].metaData.page || 0;
			cgControl[this.plugin.settings.source].searchHandler(tags, page, this.plugin.settings.safeMode).then(res => {
				if (res.length === 0) {
					new Notice("Ciallo～(∠·ω< )⌒: not found~");
					return;
				}
				new Notice("Ciallo～(∠·ω< )⌒: I Get!")
				res.forEach((item, ind) => {
					const img = div.createEl('img', {
						attr: {
							src: item.src as string,
						}
					})
					let flag = true;
					img.classList.add("cg-img", "loading-image")
					img.onerror = ((e: Event, source?: string, lineno?: number, colno?: number, error?: Error) => {
						if (flag) {
							img.src = item.downloadSrc;
							flag = false;
						}
					})
					img.onload = () => {
						img.classList.add("loaded");
					}
					img.onclick = async () => {
						// 获取downloadSrc 下的文件复制到剪切板
						const downloadURL = item.downloadSrc
						// 以插入图片的形式写入obsidian
						const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
						if (editor) {
							editor.replaceSelection(`![](${downloadURL})`);
							await this.plugin.clipboard.writeText(downloadURL); // 写入剪切板
						}
						this.close();
					}

					const describeDiv = div.createEl('div', {
						attr: {
							class: "describe-tags"
						}
					})
					describeDiv.createEl('span', {
						text: `${item.width}x${item.height}`,
						attr: {
							class: 'cg-img-size-tag'
						}
					})
					if (item.tags) {
						describeDiv.createEl('span', {
							text: `${item.tags.slice(0, 5).join(',')}`,
							attr: {
								class: 'cg-img-tag-tag'
							}
						})
					}
				})
				const button = div.createEl('button', {
					text: "Next Page"
				});

				button.classList.add('next_btn');

				button.onclick = () => {
					if (cgControl[this.plugin.settings.source].metaData.page) {
						cgControl[this.plugin.settings.source].metaData.page +=1;
					} else {
						cgControl[this.plugin.settings.source].metaData.page = 2;
					}
					isSearch = false;
					search();
					new Notice("Ciallo～(∠·ω< )⌒: next page~");
					button.parentElement?.removeChild(button);
				}
			})
		}, 1000, true);

		inputArea.oninput = (ev: Event) => {
			if (ev.target) {
				this.tags = (ev.target as HTMLInputElement).value || "";
			} else {
				this.tags = ""
			}
			const tags = this.tags.split(",").map((tag) => tag.trim())
			if (this.plugin.settings.source) {
				cgControl[this.plugin.settings.source].metaData.tags = tags;
			} else {
				this.plugin.settings.source = "anime-picture"
				cgControl[this.plugin.settings.source].metaData.tags = tags;
			}
			isSearch = true;
			search();
		}

		div.onscroll = (ev: Event) => {
			console.log("Event");
		}
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty()
		for (const source of Object.keys(cgControl)) {
			cgControl[source].metaData.page = 0;
		}
	}
}
