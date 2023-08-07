from flask import Flask, request, jsonify
from .config import config

import scallopy
import os


def create_app(config_name=None):
    app = Flask(__name__)
    config_name = config_name or os.environ.get("FLASK_ENV") or "default"
    app.config.from_object(config[config_name])

    @app.route("/api/run-scallop", methods=["POST"])
    def run_scallop():
        request_data = request.get_json()
        inputs, program, outputs = (
            request_data["inputs"],
            request_data["program"],
            request_data["outputs"],
        )

        # Write logic program to scl file
        if not os.path.exists(app.config["TMP_PATH"]):
            os.makedirs(app.config["TMP_PATH"])
        scallop_file = os.path.join(app.config["TMP_PATH"], "program.scl")
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
        data = []
        for relation in outputs:
            data.append(list(ctx.relation(relation)))

        return jsonify(data)

    return app
