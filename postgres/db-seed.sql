CREATE TABLE acme_products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    category VARCHAR(255),
    price DECIMAL(5, 2),
    stock INT
);

INSERT INTO acme_products (id, name, description, category, price, stock) VALUES
(1, 'GiggleNoMore', 'Stops uncontrollable laughter', 'Medicine', 19.99, 100),
(2, 'LazyBuster', 'Cures chronic laziness', 'Medicine', 29.99, 200),
(3, 'NappAway', 'Fights against sudden urges to nap during work hours', 'Medicine', 39.99, 50),
(4, 'SneezeBeGone', 'Instantly halts sneezing in allergy season', 'Medicine', 9.99, 150),
(5, 'TalkLessPill', 'Reduces the desire to talk non-stop during meetings', 'Medicine', 14.99, 75);
