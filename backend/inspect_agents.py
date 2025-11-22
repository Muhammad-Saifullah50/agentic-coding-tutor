import agents
import inspect
import pkgutil

print("Agents package location:", agents.__file__)
print("\nTop level attributes:")
print(dir(agents))

def find_class(module, class_name):
    if hasattr(module, "__path__"):
        for _, name, is_pkg in pkgutil.walk_packages(module.__path__):
            full_name = module.__name__ + "." + name
            try:
                sub_module = __import__(full_name, fromlist=[""])
                if hasattr(sub_module, class_name):
                    print(f"\nFound {class_name} in: {full_name}")
                    return
            except Exception as e:
                pass

print("\nSearching for SQLAlchemySession...")
find_class(agents, "SQLAlchemySession")
