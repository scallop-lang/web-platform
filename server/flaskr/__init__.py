from flask import Flask, request, jsonify

import scallopy
import os

DIR_PATH = "../.tmp"

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/api/run-scallop", methods=['POST'])
    def run_scallop():
        request_data = request.get_json()
        inputs, program, outputs = request_data["inputs"], request_data["program"], request_data["outputs"]

        # Write logic program to scl file
        if not os.path.exists(DIR_PATH):
            os.makedirs(DIR_PATH)
        scallop_file = os.path.join(DIR_PATH, "program.scl")
        with open(scallop_file, "w") as f:
            f.write(program)

        # Initialize Scallop context
        ctx = scallopy.ScallopContext(provenance="topkproofs") # should allow user to change provenance
        ctx.import_file(scallop_file)

        # Add input relations
        for relation in inputs:
            ctx.add_relation(relation["name"], (str, str))
            ctx.add_facts(relation["name"], [(tag, tuple(tup)) for tag, tup in relation["facts"]])

        # Execute the program
        ctx.run()

        # Extract output relations
        data = []
        for relation in outputs:
            data.append(list(ctx.relation(relation)))

        return jsonify(data)
    
    return app