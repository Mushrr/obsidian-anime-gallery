// Modal
import { App, debounce, Modal, MarkdownView, Notice } from 'obsidian'
import cgControl from 'cgurls';

export class AnimeGalleryModal extends Modal {
	// tags
	tags: string;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		const inputArea = contentEl.createEl('input', {
			placeholder: "please input some tags: blue_eyes,empty_background"
		})
		inputArea.classList.add("input-area")
		const div = contentEl.createEl('div')
		div.classList.add("cg-img-container")
		const search = debounce(() => {
			new Notice("Ciallo～(∠·ω< )⌒: start searching~");
			const tags = cgControl["anime-pictures"].metaData.tags || [];
			const page = cgControl["anime-pictures"].metaData.page || 0;
			cgControl["anime-pictures"].searchHandler(tags, page).then(res => {
				div.empty();
				if (res.length === 0) {
					new Notice("Ciallo～(∠·ω< )⌒: not found~");
					return;
				}

				new Notice("Ciallo～(∠·ω< )⌒: I Get!")
				res.forEach((item) => {
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
					img.onclick = () => {
						// 获取downloadSrc 下的文件复制到剪切板
						const downloadURL = item.downloadSrc
						// 以插入图片的形式写入obsidian
						const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
						if (editor) {
							editor.replaceSelection(`![](${downloadURL})`);
						}
						this.close();
					}
				})
			})
		}, 1000, true);

		inputArea.oninput = (ev: Event) => {
			if (ev.target) {
				this.tags = (ev.target as HTMLInputElement).value || "";
			} else {
				this.tags = ""
			}
			const tags = this.tags.split(",").map((tag) => tag.trim())
			cgControl["anime-pictures"].metaData.tags = tags;
			search();
		}

	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty()
	}
}
