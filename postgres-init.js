db.createUser(
    {
        user: 'postgres',
        pwd: 'abz_base',
        roles: [
            {
                role: 'readWrite',
                db: 'postgres'
            }
        ]
    }
)