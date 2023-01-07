class UserRepository {
	constructor({ db }) {
		this.db = db;
	}

	async create(user) {
		const { email, password, username } = user;
		return this.db
			.prepare('INSERT INTO users (email, password, username) VALUES (?, ?, ?)')
			.bind(email, password, username)
			.run()
			.catch((error) => {
				console.log('Error creating user', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.create(user);
					});
				}
				return null;
			});
	}

	async update(user) {
		const { id, first_name, last_name, username, profile_image_url } = user;
		return this.db
			.prepare(
				'UPDATE users SET first_name = ?, last_name = ?, username = ?, profile_image_url = ? WHERE id = ?'
			)
			.bind(first_name, last_name, username, profile_image_url, id)
			.run()
			.catch((error) => {
				console.log('Error updating user', error);
				return null;
			});
	}

	async findById(id) {
		const user = await this.db
			.prepare('SELECT * FROM users WHERE id = ?')
			.bind(id)
			.first()
			.catch((error) => {
				console.log('Error fetching user', error);
				return null;
			});
		return user;
	}

	async findByEmail(email) {
		const user = await this.db
			.prepare('SELECT * FROM users WHERE email = ?')
			.bind(email)
			.first()
			.catch((error) => {
				console.log('Error fetching user', error);
				return null;
			});
		return user;
	}

	async findByUsername(username) {
		const user = await this.db
			.prepare('SELECT * FROM users WHERE username = ?')
			.bind(username)
			.first()
			.catch((error) => {
				console.log('Error fetching user', error);
				return null;
			});
		return user;
	}

	async setupTable() {
		return this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      first_name TEXT NULL,
      last_name TEXT NULL,
      email TEXT UNIQUE,
      username TEXT UNIQUE NULL,
      password TEXT,
			profile_image_url TEXT NULL,
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

export default UserRepository;
