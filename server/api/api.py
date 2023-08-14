from flask import Blueprint, request, jsonify
import scallopy

api_routes = Blueprint("api_routes", __name__)

TYPES = {
    "String": "String",
    "Integer": "i64",
    "Float": "f64",
    "Boolean": "bool",
}


@api_routes.route("/api/run-scallop", methods=["POST"])
def run_scallop():
    # Process request
    request_data = request.get_json()
    inputs, program, outputs = (
        request_data["inputs"],
        request_data["program"],
        request_data["outputs"],
    )

    # Initialize Scallop context
    ctx = scallopy.ScallopContext(provenance="topkproofs") # should allow user to change provenance
    ctx.add_program(program)

    # Add input relations
    for relation in inputs:
        ctx.add_relation(relation["name"], tuple(TYPES[arg["type"]] for arg in relation["args"]))
        ctx.add_facts(
            relation["name"], [(tag, tuple(tup)) for tag, tup in relation["facts"]]
        )

    # Execute the program
    ctx.run()

    # Extract output relations
    data = {relation["name"]: list(ctx.relation(relation["name"])) for relation in outputs}

    return jsonify(data)