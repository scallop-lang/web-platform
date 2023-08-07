def test_scallop_parent(client):
    response = client.post("/api/run-scallop", json={
        "inputs": [
            {
                "name": "parent",
                "facts": [
                    (None, ("Emily", "Bob")),
                    (None, ("Bob", "Alice"))
                ]
            }
        ],
        "program": "rel grandparent(a, c) = parent(a, b), parent(b, c)",
        "outputs": ["grandparent"],
    })
    assert response.json == [[[1.0, ['Emily', 'Alice']]]]