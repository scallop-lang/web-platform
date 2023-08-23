from flask import Blueprint, request, jsonify
import scallopy
import scallopy_ext

api_routes = Blueprint("api_routes", __name__)

TYPES = {
    "String": "String",
    "Integer": "i64",
    "Float": "f64",
    "Boolean": "bool",
}


class Args:
    def __init__(self):
        self.cuda = False
        self.gpu = None
        self.num_allowed_openai_request = 100
        self.openai_gpt_model = "gpt-4"
        self.openai_gpt_temperature = 0


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
    scallopy_ext.config.configure(Args())
    ctx = scallopy.ScallopContext(provenance="topkproofs") # should allow user to change provenance
    scallopy_ext.extlib.load_extlib(ctx)
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
