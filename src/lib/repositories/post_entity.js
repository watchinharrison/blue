class PostEntityRepository {
	constructor({ db }) {
		this.db = db;
	}

	// hashtags, media, urls, mentions
	async create(postEntity) {
		const { type, post_id, indices, url, entity_type, height, width } = postEntity;
		return this.db
			.prepare(
				'INSERT INTO post_entities (type, post_id, indices, url, entity_type, height, width) VALUES (?, ?, ?, ?, ?, ?, ?)'
			)
			.bind(type, post_id, indices, url, entity_type, height, width)
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
			.prepare('SELECT * FROM post_entities WHERE post_id = ?')
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
      type TEXT NULL,
      post_id INTEGER,
      indices TEXT NULL,
      url TEXT NULL,
      entity_type TEXT NULL,
			width INTEGER,
			height INTEGER,
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
