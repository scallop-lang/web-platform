def test_scallop_parent(client):
    response = client.post(
        "/api/run-scallop",
        json={
            "inputs": [
                {
                    "name": "parent",
                    "args": [
                        {"name": "a", "type": "String"},
                        {"name": "b", "type": "String"},
                    ],
                    "facts": [(None, ("Emily", "Bob")), (None, ("Bob", "Alice"))],
                }
            ],
            "program": "rel grandparent(a, c) = parent(a, b), parent(b, c)",
            "outputs": [{"name": "grandparent"}],
        },
    )
    assert response.json == {"grandparent": [[1.0, ["Emily", "Alice"]]]}


def test_scallop_sum_float(client):
    response = client.post(
        "/api/run-scallop",
        json={
            "inputs": [
                {
                    "name": "num",
                    "args": [
                        {"name": "a", "type": "Float"},
                    ],
                    "facts": [(None, (1,)), (None, (6.9,))],
                }
            ],
            "program": "rel sum(a + b) = num(a), num(b)",
            "outputs": [{"name": "sum"}],
        },
    )
    assert response.json == {"sum": [[1.0, [2]], [1.0, [7.9]], [1.0, [13.8]]]}


def test_scallop_or_bool(client):
    response = client.post(
        "/api/run-scallop",
        json={
            "inputs": [
                {
                    "name": "bool1",
                    "args": [
                        {"name": "a", "type": "Boolean"},
                    ],
                    "facts": [(None, (True,))],
                },
                {
                    "name": "bool2",
                    "args": [
                        {"name": "a", "type": "Boolean"},
                    ],
                    "facts": [(None, (False,))],
                },
            ],
            "program": "rel lor(a ^ b) = bool1(a), bool2(b)",
            "outputs": [{"name": "lor"}],
        },
    )
    assert response.json == {"lor": [[1.0, [True]]]}
