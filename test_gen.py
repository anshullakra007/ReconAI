import sys
sys.path.append('backend')
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy import create_engine
import generate_data
import models

engine = create_engine('sqlite:///:memory:')
models.Base.metadata.create_all(engine)
db = Session(engine)

try:
    generate_data.generate_data(db, models)
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
