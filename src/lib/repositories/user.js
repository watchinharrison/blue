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
		const { id, display_name, username, profile_image_url, header_image_url, bio } = user;
		const updateQuery = 'UPDATE users SET ';
		const updateSet = [];
		const updateValues = [];
		if (display_name) {
			updateSet.push(`display_name = ?`);
			updateValues.push(display_name);
		}
		if (username) {
			updateSet.push(`username = ?`);
			updateValues.push(username);
		}
		if (profile_image_url) {
			updateSet.push(`profile_image_url = ?`);
			updateValues.push(profile_image_url);
		}
		if (header_image_url) {
			updateSet.push(`header_image_url = ?`);
			updateValues.push(header_image_url);
		}
		if (bio) {
			updateSet.push(`bio = ?`);
			updateValues.push(bio);
		}
		updateSet.push(`updated_at = ?`);
		updateValues.push(new Date().toISOString());
		const updateQueryWithValues = updateQuery + updateSet.join(', ') + ' WHERE id = ?';
		updateValues.push(id);
		return this.db
			.prepare(updateQueryWithValues)
			.bind(...updateValues)
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
      first_name VARCHAR(255) NULL,
      last_name VARCHAR(255) NULL,
			display_name VARCHAR(50) NULL,
			bio VARCHAR(1024) NULL,
      email VARCHAR(255) UNIQUE,
      username VARCHAR(16) UNIQUE NULL,
      password VARCHAR(255),
			profile_image_url TEXT NULL,
			header_image_url TEXT NULL,
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
