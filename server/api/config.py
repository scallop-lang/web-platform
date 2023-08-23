import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    TMP_PATH = os.path.join(basedir, "../.tmp/")


class DevConfig(Config):
    TESTING = False
    DEBUG = True


class TestConfig(Config):
    TESTING = True


config = {
    "development": DevConfig,
    "testing": TestConfig,
    "default": DevConfig,
}
