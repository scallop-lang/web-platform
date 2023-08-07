import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    TMP_PATH = os.path.join(basedir, "../.tmp/")


class DevConfig(Config):
    DEBUG = True
    TESTING = False


class TestConfig(Config):
    DEBUG = True
    TESTING = True


config = {
    "development": DevConfig,
    "testing": TestConfig,
    "default": DevConfig,
}
