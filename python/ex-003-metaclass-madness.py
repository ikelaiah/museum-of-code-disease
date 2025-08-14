# ex-003-metaclass-madness.py
# INTENTIONALLY AWFUL: Python metaclass abuse and import hook manipulation
# This file celebrates unnecessary metaclass complexity and descriptor protocol abuse
# WARNING: This code will make your Python interpreter question its existence

import sys
import types
import importlib.util
import importlib.machinery
from functools import wraps
from collections import defaultdict

# Global state for tracking metaclass chaos
METACLASS_REGISTRY = {}
DESCRIPTOR_CHAOS = defaultdict(list)
IMPORT_HOOKS_ACTIVE = []

# Metaclass that does way too much
class ChaosMetaclass(type):
    """Metaclass that interferes with everything"""
    
    def __new__(mcs, name, bases, namespace, **kwargs):
        print(f"🔥 Creating class {name} with CHAOS metaclass")
        
        # Modify all methods to add logging
        for key, value in list(namespace.items()):
            if callable(value) and not key.startswith('__'):
                namespace[key] = mcs._add_chaos_logging(value, name, key)
        
        # Add random attributes
        namespace['_chaos_id'] = id(mcs)
        namespace['_creation_time'] = __import__('time').time()
        namespace['_metaclass_level'] = getattr(mcs, '_level', 0) + 1
        
        # Create the class
        cls = super().__new__(mcs, name, bases, namespace)
        
        # Register in global registry
        METACLASS_REGISTRY[name] = cls
        
        # Modify the class after creation
        cls._post_creation_chaos = lambda self: f"CHAOS_{name}_{id(self)}"
        
        return cls
    
    def __init__(cls, name, bases, namespace, **kwargs):
        super().__init__(name, bases, namespace)
        
        # Add more chaos after initialization
        cls._initialized = True
        cls._chaos_counter = 0
        
        # Monkey patch existing methods
        if hasattr(cls, '__str__'):
            original_str = cls.__str__
            def chaotic_str(self):
                cls._chaos_counter += 1
                return f"CHAOS[{cls._chaos_counter}]: {original_str(self)}"
            cls.__str__ = chaotic_str
    
    def __call__(cls, *args, **kwargs):
        print(f"🎭 Instantiating {cls.__name__} with metaclass interference")
        
        # Modify arguments before creating instance
        if args:
            args = tuple(f"CHAOS_{arg}" if isinstance(arg, str) else arg for arg in args)
        
        kwargs['_metaclass_injected'] = True
        
        # Create instance
        instance = super().__call__(*args, **kwargs)
        
        # Modify instance after creation
        instance._chaos_metadata = {
            'created_by_metaclass': True,
            'creation_args': args,
            'creation_kwargs': kwargs
        }
        
        return instance
    
    @staticmethod
    def _add_chaos_logging(func, class_name, method_name):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print(f"📞 Calling {class_name}.{method_name} with CHAOS logging")
            try:
                result = func(*args, **kwargs)
                print(f"✅ {class_name}.{method_name} completed successfully")
                return result
            except Exception as e:
                print(f"💥 {class_name}.{method_name} failed with: {e}")
                raise
        return wrapper

# Nested metaclass hierarchy for maximum confusion
class SuperChaosMetaclass(ChaosMetaclass):
    """Metaclass that inherits from another metaclass"""
    
    def __new__(mcs, name, bases, namespace, **kwargs):
        print(f"🌪️ SUPER CHAOS metaclass creating {name}")
        
        # Add even more chaos
        namespace['_super_chaos'] = True
        namespace['_level'] = getattr(mcs, '_level', 0) + 1
        
        # Modify all attributes
        for key, value in list(namespace.items()):
            if not key.startswith('__') and not callable(value):
                namespace[f"chaos_{key}"] = f"MODIFIED_{value}"
        
        return super().__new__(mcs, name, bases, namespace, **kwargs)

# Descriptor protocol abuse
class ChaosDescriptor:
    """Descriptor that causes maximum confusion"""
    
    def __init__(self, name=None, default=None):
        self.name = name
        self.default = default
        self.access_count = 0
        self.modification_count = 0
    
    def __set_name__(self, owner, name):
        self.name = name
        self.owner = owner
        DESCRIPTOR_CHAOS[owner.__name__].append(self)
        print(f"🎯 Descriptor {name} attached to {owner.__name__}")
    
    def __get__(self, instance, owner):
        self.access_count += 1
        print(f"🔍 Accessing {self.name} (access #{self.access_count})")
        
        if instance is None:
            return self
        
        # Side effects in __get__
        if not hasattr(instance, f'_{self.name}_storage'):
            setattr(instance, f'_{self.name}_storage', self.default)
        
        # Modify the value on each access
        current_value = getattr(instance, f'_{self.name}_storage')
        if isinstance(current_value, str):
            modified_value = f"ACCESSED_{self.access_count}_{current_value}"
            setattr(instance, f'_{self.name}_storage', modified_value)
            return modified_value
        
        return current_value
    
    def __set__(self, instance, value):
        self.modification_count += 1
        print(f"✏️ Setting {self.name} to {value} (modification #{self.modification_count})")
        
        # Side effects in __set__
        setattr(instance, f'_{self.name}_storage', f"MODIFIED_{value}")
        setattr(instance, f'_{self.name}_history', 
                getattr(instance, f'_{self.name}_history', []) + [value])
        
        # Global side effect
        DESCRIPTOR_CHAOS['modifications'].append({
            'descriptor': self.name,
            'instance': id(instance),
            'value': value,
            'count': self.modification_count
        })
    
    def __delete__(self, instance):
        print(f"🗑️ Deleting {self.name}")
        if hasattr(instance, f'_{self.name}_storage'):
            delattr(instance, f'_{self.name}_storage')

# Context manager misuse
class ChaosContextManager:
    """Context manager with side effects everywhere"""
    
    def __init__(self, name, should_fail=False):
        self.name = name
        self.should_fail = should_fail
        self.entered = False
        self.exited = False
    
    def __enter__(self):
        print(f"🚪 Entering context {self.name}")
        self.entered = True
        
        # Side effects in __enter__
        global METACLASS_REGISTRY
        METACLASS_REGISTRY[f'context_{self.name}'] = self
        
        # Modify global state
        sys.modules[__name__].__dict__[f'CONTEXT_{self.name.upper()}'] = True
        
        # Return something unexpected
        return f"CHAOS_CONTEXT_{self.name}"
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"🚪 Exiting context {self.name}")
        self.exited = True
        
        # Side effects in __exit__
        if f'CONTEXT_{self.name.upper()}' in sys.modules[__name__].__dict__:
            del sys.modules[__name__].__dict__[f'CONTEXT_{self.name.upper()}']
        
        # Suppress exceptions randomly
        if self.should_fail and exc_type:
            print(f"🤫 Suppressing exception: {exc_type.__name__}")
            return True  # Suppress the exception
        
        # Raise new exceptions
        if not self.should_fail and exc_type is None:
            print(f"💥 Raising exception from __exit__")
            raise RuntimeError(f"Context {self.name} decided to fail")
        
        return False

# Import hook manipulation
class ChaosImportHook:
    """Import hook that modifies modules during import"""
    
    def __init__(self):
        self.modified_modules = []
    
    def find_spec(self, fullname, path, target=None):
        if fullname.startswith('chaos_'):
            print(f"🎣 Import hook intercepting {fullname}")
            return importlib.machinery.ModuleSpec(
                fullname, 
                ChaosLoader(fullname),
                origin='CHAOS_GENERATED'
            )
        return None

class ChaosLoader:
    """Loader that creates modules with chaos"""
    
    def __init__(self, fullname):
        self.fullname = fullname
    
    def create_module(self, spec):
        print(f"🏭 Creating chaos module {self.fullname}")
        module = types.ModuleType(self.fullname)
        module.__chaos__ = True
        module.__loader__ = self
        return module
    
    def exec_module(self, module):
        print(f"⚡ Executing chaos module {module.__name__}")
        
        # Add chaos to the module
        module.CHAOS_CONSTANT = "INJECTED_BY_LOADER"
        module.chaos_function = lambda: f"CHAOS from {module.__name__}"
        
        # Add a class with metaclass
        class ChaosInjectedClass(metaclass=ChaosMetaclass):
            def __init__(self):
                self.injected = True
        
        module.ChaosInjectedClass = ChaosInjectedClass

# Classes using the chaotic metaclasses
class ChaosClass(metaclass=ChaosMetaclass):
    """Class with chaos metaclass"""
    
    chaos_descriptor = ChaosDescriptor("chaos_descriptor", "DEFAULT_CHAOS")
    another_descriptor = ChaosDescriptor("another_descriptor", 42)
    
    def __init__(self, name="CHAOS"):
        self.name = name
        self.created = True
        print(f"🎪 ChaosClass instance created: {name}")
    
    def chaos_method(self):
        return f"CHAOS METHOD: {self.name}"
    
    def descriptor_test(self):
        # Access descriptors to trigger their chaos
        print(f"Descriptor value: {self.chaos_descriptor}")
        self.chaos_descriptor = "NEW_CHAOS_VALUE"
        return self.another_descriptor

class SuperChaosClass(ChaosClass, metaclass=SuperChaosMetaclass):
    """Class with super chaos metaclass"""
    
    super_descriptor = ChaosDescriptor("super_descriptor", "SUPER_DEFAULT")
    
    def __init__(self, name="SUPER_CHAOS"):
        super().__init__(name)
        self.super_chaos = True
        print(f"🌪️ SuperChaosClass instance created: {name}")
    
    def super_chaos_method(self):
        return f"SUPER CHAOS: {self.name}"

# Function that uses all the chaos
def metaclass_chaos_demo():
    print("🎭 Starting metaclass chaos demonstration")
    
    # Install import hook
    import_hook = ChaosImportHook()
    sys.meta_path.insert(0, import_hook)
    IMPORT_HOOKS_ACTIVE.append(import_hook)
    
    try:
        # Import a chaos module
        chaos_module = importlib.import_module('chaos_test_module')
        print(f"Imported chaos module: {chaos_module}")
        
        # Use the injected class
        injected_instance = chaos_module.ChaosInjectedClass()
        print(f"Injected instance: {injected_instance}")
    except Exception as e:
        print(f"Import chaos failed: {e}")
    
    # Create instances with metaclass chaos
    chaos1 = ChaosClass("FIRST_CHAOS")
    chaos2 = SuperChaosClass("SECOND_CHAOS")
    
    # Test descriptors
    print(f"Testing descriptors:")
    chaos1.descriptor_test()
    chaos2.super_descriptor = "MODIFIED_SUPER"
    
    # Test context manager chaos
    try:
        with ChaosContextManager("TEST_CONTEXT", should_fail=False) as ctx:
            print(f"Inside context: {ctx}")
            chaos1.chaos_method()
    except Exception as e:
        print(f"Context manager chaos: {e}")
    
    # Test context manager that suppresses exceptions
    try:
        with ChaosContextManager("SUPPRESSING_CONTEXT", should_fail=True) as ctx:
            raise ValueError("This should be suppressed")
    except Exception as e:
        print(f"Exception not suppressed: {e}")
    
    return {
        'chaos1': chaos1,
        'chaos2': chaos2,
        'registry': METACLASS_REGISTRY,
        'descriptors': dict(DESCRIPTOR_CHAOS)
    }

# Main chaos function
def main():
    print("🐍 PYTHON METACLASS NIGHTMARE STARTING! 🐍")
    
    # Run metaclass chaos
    results = metaclass_chaos_demo()
    
    print("\n🔥 METACLASS CHAOS COMPLETE! 🔥")
    print(f"Metaclass registry: {len(METACLASS_REGISTRY)} classes")
    print(f"Descriptor chaos: {len(DESCRIPTOR_CHAOS)} descriptors")
    print(f"Import hooks active: {len(IMPORT_HOOKS_ACTIVE)}")
    
    # Print some results
    for name, obj in results.items():
        if hasattr(obj, '__dict__'):
            print(f"{name}: {obj.__dict__}")
        else:
            print(f"{name}: {obj}")
    
    return results

if __name__ == "__main__":
    main()
