import { URL } from "url"
import { urlSearchParamSerialize } from "utils"
import { requestUrl } from 'obsidian'

interface CGMetadata {
	name: string,
	url: string,
	tags: string[],
	[extra: string]: any
}

interface imageItem {
	src: string,
	downloadSrc: string,
	id: number,
	height: number,
	width: number
}

type searchHandler = (tags: string[], page: number) => Promise<imageItem[]>
type selectHandler = (url: string) => {}

interface CG {
	metaData: CGMetadata,
	searchHandler: searchHandler,
}

interface CgControl {
	[name: string]: CG
}

type cgItem = {
	id: number,
	md5: string,
	color: number[],
	datetime: string,
	download_count: number,
	erotics: number,
	ext: string,
	have_alpha: boolean,
	height: number,
	artefacts_degree: number,
	md5_pixels: string,
	pubtime: string,
	redirect_id: string | null,
	score: number,
	score_number: number,
	smooth_degree: number,
	spoiler: boolean,
	status: number,
	status_type: number,
	tags_count: number,
	width: number,
	[props: string]: any
}

const animePictureCG: CG = {
	metaData: {
		name: "AnimePictures",
		url: "https://anime-pictures.net/api/v3/posts",
		previewUrl: "https://cdn.anime-pictures.net/previews/",
		downloadUrl: "https://images.anime-pictures.net/",
		currentData: {},
		tags: []
	},
	async searchHandler(tags: string[], page: number = 0) {
		console.log("开始搜索!");
		const queryParam = {
			page: page,
			order_by: "date",
			ldate: 0
		}
		const nestedUrl = this.metaData.url + "?lang=en&search_tag=" + tags.join(",") + 
						'&' + urlSearchParamSerialize(queryParam);
		console.log(nestedUrl);
		let result: imageItem[] = []
		const response = await requestUrl({
			url: nestedUrl,
		})
		this.metaData.currentData = response;
		if (Array.isArray(response.json.posts)) {
			result = response.json.posts.map((item: cgItem) => {
				return {
					src: this.metaData.previewUrl + item.md5.slice(0, 3) + `/${item.md5}_cp${item.ext}`,
					downloadSrc: this.metaData.downloadUrl + item.md5.slice(0, 3) + `/${item.md5}${item.ext}`,
					id: item.id,
					height: item.height,
					width: item.width
				}
			})
		}
		console.log(result);
		return result
	}
}

const cgControl: CgControl = {
	"anime-pictures": animePictureCG
}

export default cgControl;