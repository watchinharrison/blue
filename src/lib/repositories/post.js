class PostRepository {
	constructor({ db }) {
		this.db = db;
	}

	async create(post) {
		const { text, user_id } = post;
		return this.db
			.prepare('INSERT INTO posts (text, user_id) VALUES (?, ?)')
			.bind(text, user_id)
			.run()
			.catch((error) => {
				console.log('Error creating post', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.create(post);
					});
				}
				return null;
			});
	}

	async findAll() {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username FROM posts p INNER JOIN users as u ON p.user_id = u.id ORDER BY p.created_at DESC'
			)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async findById(id) {
		const { first_name, last_name, username, ...post } = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE p.id = ?'
			)
			.bind(id)
			.first()
			.catch((error) => {
				console.log('Error fetching post', error);
				return null;
			});
		return {
			...post,
			user: {
				profile_image_url: 'https://loremflickr.com/50/50',
				first_name: first_name,
				last_name: last_name,
				username: username
			}
		};
	}

	async findByUserId(user_id) {
		const posts = await this.db
			.prepare('SELECT * FROM posts WHERE user_id = ?')
			.bind(user_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return null;
			});
		return posts;
	}

	async setupTable() {
		return this.db
			.prepare(
				`CREATE TABLE posts (
      id INTEGER PRIMARY KEY,
      text TEXT NULL,
      user_id INTEGER,
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

export default PostRepository;
