class PostEntityRepository {
	constructor({ db }) {
		this.db = db;
	}

	// hashtags, media, urls, mentions
	async create(postEntity) {
		const {
			type,
			post_id,
			indices,
			url,
			entity_type,
			height,
			width,
			thumbnail_url,
			title,
			description
		} = postEntity;
		const insetQuery = 'INSERT INTO post_entities';
		const insertSet = [];
		const insertValues = [];
		if (type) {
			insertSet.push('type');
			insertValues.push(type);
		}
		if (post_id) {
			insertSet.push('post_id');
			insertValues.push(post_id);
		}
		if (indices) {
			insertSet.push('indices');
			insertValues.push(indices);
		}
		if (url) {
			insertSet.push('url');
			insertValues.push(url);
		}
		if (entity_type) {
			insertSet.push('entity_type');
			insertValues.push(entity_type);
		}
		if (height) {
			insertSet.push('height');
			insertValues.push(height);
		}
		if (width) {
			insertSet.push('width');
			insertValues.push(width);
		}
		if (thumbnail_url) {
			insertSet.push('thumbnail_url');
			insertValues.push(thumbnail_url);
		}
		if (title) {
			insertSet.push('title');
			insertValues.push(title);
		}
		if (description) {
			insertSet.push('description');
			insertValues.push(description);
		}
		const insertQueryWithValues =
			insetQuery +
			' (' +
			insertSet.join(', ') +
			') VALUES (' +
			insertValues.map(() => '?').join(', ') +
			')';
		console.log(insertQueryWithValues);
		console.log(insertValues);
		return this.db
			.prepare(insertQueryWithValues)
			.bind(...insertValues)
			.run()
			.catch((error) => {
				console.log('Error creating post entity', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.create(postEntity);
					});
				}
				return null;
			});
	}

	async findById(id) {
		const post = await this.db
			.prepare('SELECT * FROM post_entities WHERE id = ?')
			.bind(id)
			.first()
			.catch((error) => {
				console.log('Error fetching post entity', error);
				return {};
			});
		return post;
	}

	async findByPostId(post_id) {
		const post = await this.db
			.prepare('SELECT * FROM post_entities WHERE post_id = ? LIMIT 4')
			.bind(post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching post entities', error);
				return [];
			});
		return post.results;
	}

	async setupTable() {
		return this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS post_entities (
      id INTEGER PRIMARY KEY,
      type VARCHAR(12) NULL,
      post_id INTEGER,
      indices VARCHAR(12) NULL,
      url VARCHAR(255) NULL,
      entity_type VARCHAR(12) NULL,
			width INTEGER,
			height INTEGER,
			thumbnail_url VARCHAR(255) NULL,
			title VARCHAR(255) NULL,
			description VARCHAR(255) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL
    )`
			)
			.run()
			.catch((tableError) => {
				console.log('tableError', tableError);
			});
	}
}

export default PostEntityRepository;
