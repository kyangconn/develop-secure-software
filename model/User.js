const {client} = require('../database.js')

class User {
    constructor({id, name, email, created_at}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.created_at = created_at;
        this.deleted = false;
    }

    // 实例方法：保存新用户
    async create() {
        try {
            const result = await client.query(
                'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
                [this.name, this.email]
            );
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error('Create User Failed: ' + error.message);
        }
    }

    // 实例方法：更新用户
    async update() {
        try {
            const result = await client.query(
                'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
                [this.name, this.email, this.id]
            );
            return new User(result.rows[0]);
        } catch (error) {
            throw new Error('Update User Failed: ' + error.message);
        }
    }

    // 实例方法：删除用户
    async delete() {
        try {
            await client.query('UPDATE users SET is', [this.id]);
            return true;
        } catch (error) {
            throw new Error('Delete User Failed: ' + error.message);
        }
    }

    // 静态方法：根据ID查找用户
    static async findById(id) {
        try {
            const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rowCount ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`查找用户失败: ${error.message}`);
        }
    }

    // 静态方法：获取所有用户
    static async findAll() {
        try {
            const result = await client.query('SELECT * FROM users ORDER BY id');
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw new Error(`获取用户列表失败: ${error.message}`);
        }
    }

    // 静态方法：分页查询
    static async paginate({page = 1, pageSize = 10}) {
        try {
            const offset = (page - 1) * pageSize;
            const result = await client.query(
                'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
                [pageSize, offset]
            );
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw new Error(`分页查询失败: ${error.message}`);
        }
    }

    // 数据验证方法
    validate() {
        const errors = [];
        if (!this.name || this.name.trim().length < 2) {
            errors.push('姓名至少需要2个字符');
        }
        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            errors.push('邮箱格式不正确');
        }
        return errors;
    }

    // 转换为JSON格式
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            created_at: this.created_at
        };
    }
}

module.exports = User;