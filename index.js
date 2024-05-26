let headers = {
	appversion: '2.1.0'
}

async function setMangaListFilterOptions() {
	try {
		let result = [{
			label: '分区',
			name: 'filter_class_id',
			options: [{
					label: '同人',
					value: 1
				},
				{
					label: '原创',
					value: 2
				}
			]
		}]
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithResult([])
	}
}

async function getMangaListByCategory(page, pageSize, filterOptions) {
	const url = 'https://feigeblog.com/api/channel/searchUserChannel';
	try {

		const payload = {
			filter_block: 2,
			refresh_time: Date.now().toString(),
			page: page.toString(),
			filter_class_id: filterOptions.filter_class_id
		}

		const rawResponse = await window.Rulia.httpRequest({
			url: url,
			method: 'POST',
			payload: JSON.stringify(payload),
			contentType: 'application/json',
			headers: headers
		})

		const response = JSON.parse(rawResponse);

		var result = {
			list: []
		}
		for (var manga of response.data.data) {
			var comic = {
				title: manga.name,
				url: manga.id,
				coverUrl: manga.cover
			}
			result.list.push(comic);
		}
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}


async function getMangaListBySearching(page, pageSize, keyword) {
	const url = 'https://feigeblog.com/api/channel/searchUserChannel';
	try {

		const payload = {
			filter_block: 2,
			keyword_type: 1,
			keyword: keyword.toString(),
			page: page.toString(),
			refresh_time: Date.now().toString(),
		}

		const rawResponse = await window.Rulia.httpRequest({
			url: url,
			method: 'POST',
			payload: JSON.stringify(payload),
			contentType: 'application/json',
			headers: headers
		})

		const response = JSON.parse(rawResponse);

		var result = {
			list: []
		}
		for (var manga of response.data.data) {
			var comic = {
				title: manga.name,
				url: manga.id,
				coverUrl: manga.cover
			}
			result.list.push(comic);
		}
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getMangaList(page, pageSize, keyword, rawFilterOptions) {
	if (keyword) {
		return await getMangaListBySearching(page, pageSize, keyword);
	} else {
		return await getMangaListByCategory(page, pageSize, JSON.parse(rawFilterOptions));
	}
}

async function getMangaData(dataPageUrl) {

	const url = 'https://feigeblog.com/api/ajax/getAlbumDetailById';
	const listUrl = 'https://feigeblog.com/api/ajax/getWorksListByAlbumId';

	try {
		const payload = {
			id: dataPageUrl
		}

		const listPayload = {
			id: dataPageUrl,
			page: 1,
			refreshTime: Date.now().toString(),
			order_sort: 'asc'
		}

		const rawResponse = await window.Rulia.httpRequest({
			url: url,
			method: 'POST',
			payload: JSON.stringify(payload),
			contentType: 'application/json',
			headers: headers
		})

		const listRawResponse = await window.Rulia.httpRequest({
			url: listUrl,
			method: 'POST',
			payload: JSON.stringify(listPayload),
			contentType: 'application/json',
			headers: headers
		})

		const response = JSON.parse(rawResponse);

		const listResponse = JSON.parse(listRawResponse);

		let result = {
			title: response.data.name,
			description: response.data.desc,
			coverUrl: response.data.cover,
			chapterList: []
		}

		for (var manga of listResponse.data.data) {
			let mangaTitle = manga.content;
			let match = manga.content.match(/^(.*?)\n/);
			if (match && match[1]) {
				mangaTitle = match[1]
			}
			var comic = {
				title: '[' + mangaTitle + '][' + manga.update_time + ']',
				url: manga.id
			}
			result.chapterList.push(comic);
		}

		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}



async function getChapterImageList(chapterUrl) {
	const url = 'https://feigeblog.com/api/ajax/worksDetail';

	try {
		const payload = {
			id: chapterUrl
		}

		const rawResponse = await window.Rulia.httpRequest({
			url: url,
			method: 'POST',
			payload: JSON.stringify(payload),
			contentType: 'application/json',
			headers: headers
		})

		const response = JSON.parse(rawResponse);

		let result = [];
		let list = response.data.image.split(',');

		for (var i = 0; i < list.length; i++) {
			result.push({
				url: list[i],
				index: i,
				width: 1,
				height: 1
			});
		}

		window.Rulia.endWithResult(result);

	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getImageUrl(path) {
	window.Rulia.endWithResult(path);
}