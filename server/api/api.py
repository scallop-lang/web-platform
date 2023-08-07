from flask import Blueprint, request, current_app, jsonify
import scallopy
import os

api_routes = Blueprint("api_routes", __name__)


@api_routes.route("/api/run-scallop", methods=["POST"])
def run_scallop():
    # Process request
    request_data = request.get_json()
    inputs, program, outputs = (
        request_data["inputs"],
        request_data["program"],
        request_data["outputs"],
    )

    # Write logic program to scl file
    tmp_path = current_app.config["TMP_PATH"]
    if not os.path.exists(tmp_path):
        os.makedirs(tmp_path)
    scallop_file = os.path.join(tmp_path, "program.scl")
    with open(scallop_file, "w") as f:
        f.write(program)

    # Initialize Scallop context
    ctx = scallopy.ScallopContext(
        provenance="topkproofs"
    )  # should allow user to change provenance
    ctx.import_file(scallop_file)

    # Add input relations
    for relation in inputs:
        ctx.add_relation(relation["name"], (str, str))
        ctx.add_facts(
            relation["name"], [(tag, tuple(tup)) for tag, tup in relation["facts"]]
        )

    # Execute the program
    ctx.run()

    # Extract output relations
    data = {relation: list(ctx.relation(relation)) for relation in outputs}

    return jsonify(data)
