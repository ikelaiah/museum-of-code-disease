#!/usr/bin/env python3
"""
ex-003-metaclass-madness.py AUTOPSY VERSION
INTENTIONALLY AWFUL: Python metaclass abuse and descriptor protocol chaos
This file demonstrates the darkest corners of Python's object model
AUTOPSY: Same nightmare code with detailed explanations of Python's advanced anti-patterns
"""

import sys
import types
import importlib.util
import importlib.machinery
from contextlib import contextmanager
import threading
import weakref
import gc

# PROBLEM: Metaclass that modifies everything it touches
class ChaosMetaclass(type):
    """
    PROBLEM: This metaclass demonstrates multiple anti-patterns:
    1. Modifies class attributes without permission
    2. Injects methods into every class it creates
    3. Tracks all instances globally (memory leak)
    4. Modifies method behavior dynamically
    
    WHY THIS IS PROBLEMATIC:
    - Makes classes unpredictable and hard to debug
    - Creates hidden dependencies and side effects
    - Breaks encapsulation and separation of concerns
    - Can cause memory leaks through global tracking
    
    FIX: Use composition, decorators, or explicit inheritance instead
    """
    
    # PROBLEM: Global registry of all instances (memory leak)
    _all_instances = weakref.WeakSet()                          # PROBLEM: Still tracks all instances
    _class_registry = {}                                        # PROBLEM: Global class registry
    _method_call_count = {}                                     # PROBLEM: Global method tracking
    
    def __new__(mcs, name, bases, namespace, **kwargs):
        # PROBLEM: Inject chaos methods into every class
        namespace['_chaos_id'] = f"CHAOS_{name}_{id(namespace)}" # PROBLEM: Inject private attribute
        namespace['get_chaos_id'] = lambda self: self._chaos_id  # PROBLEM: Inject method
        namespace['chaos_method'] = mcs._create_chaos_method()   # PROBLEM: Inject dynamic method
        
        # PROBLEM: Wrap all methods with call counting
        for attr_name, attr_value in list(namespace.items()):
            if callable(attr_value) and not attr_name.startswith('__'):
                namespace[attr_name] = mcs._wrap_method(attr_value, attr_name)
        
        # PROBLEM: Create class with modifications
        cls = super().__new__(mcs, name, bases, namespace)
        
        # PROBLEM: Register class globally
        mcs._class_registry[name] = cls                         # PROBLEM: Global class tracking
        
        # PROBLEM: Modify class after creation
        cls._created_at = sys._getframe().f_back.f_lineno       # PROBLEM: Access frame stack
        cls._metaclass_version = "CHAOS_1.0"                    # PROBLEM: Inject version info
        
        return cls
    
    def __call__(cls, *args, **kwargs):
        # PROBLEM: Intercept instance creation
        instance = super().__call__(*args, **kwargs)
        
        # PROBLEM: Track all instances globally
        cls._all_instances.add(instance)                        # PROBLEM: Global instance tracking
        
        # PROBLEM: Inject instance-specific chaos
        instance._instance_id = f"INSTANCE_{id(instance)}"      # PROBLEM: Inject private attribute
        instance._creation_frame = sys._getframe().f_back.f_lineno # PROBLEM: Frame inspection
        
        return instance
    
    @staticmethod
    def _create_chaos_method():
        """PROBLEM: Create method that accesses global state"""
        def chaos_method(self):
            # PROBLEM: Access metaclass global state from instance method
            method_name = f"{self.__class__.__name__}.chaos_method"
            if method_name not in ChaosMetaclass._method_call_count:
                ChaosMetaclass._method_call_count[method_name] = 0
            ChaosMetaclass._method_call_count[method_name] += 1
            return f"CHAOS: {method_name} called {ChaosMetaclass._method_call_count[method_name]} times"
        return chaos_method
    
    @staticmethod
    def _wrap_method(original_method, method_name):
        """PROBLEM: Wrap methods with global side effects"""
        def wrapped_method(self, *args, **kwargs):
            # PROBLEM: Global method call tracking
            full_name = f"{self.__class__.__name__}.{method_name}"
            if full_name not in ChaosMetaclass._method_call_count:
                ChaosMetaclass._method_call_count[full_name] = 0
            ChaosMetaclass._method_call_count[full_name] += 1
            
            # PROBLEM: Modify method behavior based on call count
            if ChaosMetaclass._method_call_count[full_name] % 3 == 0:
                print(f"CHAOS: {full_name} called {ChaosMetaclass._method_call_count[full_name]} times!")
            
            return original_method(self, *args, **kwargs)
        
        return wrapped_method

# PROBLEM: Import hook that modifies modules during import
class ChaosImportHook:
    """
    PROBLEM: This import hook demonstrates dangerous import manipulation:
    1. Modifies modules during import
    2. Injects code into imported modules
    3. Can break module functionality
    4. Creates hidden dependencies
    
    WHY THIS IS PROBLEMATIC:
    - Makes imports unpredictable and unreliable
    - Can break third-party libraries
    - Extremely difficult to debug
    - Violates principle of least surprise
    
    FIX: Use explicit module modification, monkey patching with clear documentation
    """
    
    def __init__(self):
        self.modified_modules = set()                           # PROBLEM: Track modified modules
    
    def find_spec(self, name, path, target=None):
        # PROBLEM: Intercept all module imports
        if name.startswith('_') or name in sys.builtin_module_names:
            return None  # Don't mess with private or builtin modules
        
        # PROBLEM: Find the original spec
        for finder in sys.meta_path:
            if finder is not self and hasattr(finder, 'find_spec'):
                spec = finder.find_spec(name, path, target)
                if spec is not None:
                    # PROBLEM: Wrap the loader to modify the module
                    original_loader = spec.loader
                    spec.loader = ChaosLoader(original_loader, name, self)
                    return spec
        
        return None

class ChaosLoader:
    """PROBLEM: Loader that injects chaos into every imported module"""
    
    def __init__(self, original_loader, module_name, import_hook):
        self.original_loader = original_loader
        self.module_name = module_name
        self.import_hook = import_hook
    
    def create_module(self, spec):
        # PROBLEM: Let original loader create the module
        if hasattr(self.original_loader, 'create_module'):
            return self.original_loader.create_module(spec)
        return None
    
    def exec_module(self, module):
        # PROBLEM: Execute original module first
        if hasattr(self.original_loader, 'exec_module'):
            self.original_loader.exec_module(module)
        
        # PROBLEM: Inject chaos into the module
        if self.module_name not in self.import_hook.modified_modules:
            self._inject_chaos(module)
            self.import_hook.modified_modules.add(self.module_name)
    
    def _inject_chaos(self, module):
        """PROBLEM: Inject chaos attributes and functions into module"""
        # PROBLEM: Add chaos attributes to every module
        module._chaos_injected = True                           # PROBLEM: Inject private attribute
        module._chaos_import_count = getattr(module, '_chaos_import_count', 0) + 1
        
        # PROBLEM: Inject chaos function into module
        def chaos_info():
            return f"CHAOS: Module {self.module_name} has been infected!"
        
        module.chaos_info = chaos_info                          # PROBLEM: Inject function
        
        # PROBLEM: Wrap all functions in the module
        for attr_name in dir(module):
            if not attr_name.startswith('_'):
                attr_value = getattr(module, attr_name)
                if callable(attr_value) and not isinstance(attr_value, type):
                    wrapped_func = self._wrap_function(attr_value, attr_name)
                    setattr(module, attr_name, wrapped_func)    # PROBLEM: Replace original function
    
    def _wrap_function(self, original_func, func_name):
        """PROBLEM: Wrap functions with chaos behavior"""
        def wrapped_func(*args, **kwargs):
            # PROBLEM: Add side effects to every function call
            if hasattr(original_func, '_chaos_call_count'):
                original_func._chaos_call_count += 1
            else:
                original_func._chaos_call_count = 1
            
            # PROBLEM: Occasionally inject chaos
            if original_func._chaos_call_count % 5 == 0:
                print(f"CHAOS: {self.module_name}.{func_name} called {original_func._chaos_call_count} times!")
            
            return original_func(*args, **kwargs)
        
        # PROBLEM: Copy attributes to maintain function identity
        wrapped_func.__name__ = getattr(original_func, '__name__', func_name)
        wrapped_func.__doc__ = getattr(original_func, '__doc__', None)
        wrapped_func._original_func = original_func             # PROBLEM: Keep reference to original
        
        return wrapped_func

# PROBLEM: Descriptor that breaks normal attribute access
class ChaosDescriptor:
    """
    PROBLEM: This descriptor demonstrates descriptor protocol abuse:
    1. Inconsistent get/set behavior
    2. Side effects during attribute access
    3. Global state modification
    4. Type coercion without validation
    
    WHY THIS IS PROBLEMATIC:
    - Makes attribute access unpredictable
    - Can cause performance issues
    - Breaks debugging and introspection
    - Violates principle of least surprise
    
    FIX: Use properties with clear behavior, avoid side effects in descriptors
    """
    
    # PROBLEM: Class-level state shared between all instances
    _access_count = {}                                          # PROBLEM: Global access tracking
    _value_history = {}                                         # PROBLEM: Global value history
    
    def __init__(self, name, initial_value=None):
        self.name = name
        self.initial_value = initial_value
        self._access_count[name] = 0                           # PROBLEM: Initialize global counter
        self._value_history[name] = []                         # PROBLEM: Initialize global history
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        
        # PROBLEM: Side effects during get
        self._access_count[self.name] += 1                     # PROBLEM: Modify global state on get
        
        # PROBLEM: Inconsistent behavior based on access count
        if self._access_count[self.name] % 3 == 0:
            print(f"CHAOS: {self.name} accessed {self._access_count[self.name]} times!")
        
        # PROBLEM: Return different types based on access count
        value = getattr(instance, f'_{self.name}', self.initial_value)
        
        if self._access_count[self.name] % 7 == 0:
            return f"CHAOS_MODIFIED_{value}"                   # PROBLEM: Return modified value
        elif self._access_count[self.name] % 5 == 0:
            return str(value).upper()                          # PROBLEM: Return uppercase string
        else:
            return value                                       # PROBLEM: Return original value
    
    def __set__(self, instance, value):
        # PROBLEM: Type coercion without validation
        if isinstance(value, (int, float)):
            value = str(value)                                 # PROBLEM: Convert numbers to strings
        elif isinstance(value, str) and value.isdigit():
            value = int(value)                                 # PROBLEM: Convert digit strings to int
        elif isinstance(value, bool):
            value = "TRUE" if value else "FALSE"               # PROBLEM: Convert bool to string
        
        # PROBLEM: Store value history globally
        self._value_history[self.name].append(value)           # PROBLEM: Global value tracking
        
        # PROBLEM: Limit history size by removing old values
        if len(self._value_history[self.name]) > 10:
            self._value_history[self.name].pop(0)              # PROBLEM: Arbitrary history limit
        
        # PROBLEM: Set the actual value
        setattr(instance, f'_{self.name}', value)
        
        # PROBLEM: Side effects during set
        if len(self._value_history[self.name]) % 3 == 0:
            print(f"CHAOS: {self.name} history: {self._value_history[self.name]}")
    
    def __delete__(self, instance):
        # PROBLEM: Prevent deletion with chaos message
        print(f"CHAOS: Cannot delete {self.name}! Deletion is forbidden!")
        raise AttributeError(f"CHAOS: {self.name} cannot be deleted")

# PROBLEM: Context manager that doesn't clean up properly
class ChaosContextManager:
    """
    PROBLEM: This context manager demonstrates context manager abuse:
    1. Doesn't clean up resources properly
    2. Swallows exceptions without handling them
    3. Modifies global state during context
    4. Can leave system in inconsistent state
    
    WHY THIS IS PROBLEMATIC:
    - Resource leaks when exceptions occur
    - Makes debugging nearly impossible
    - Can corrupt application state
    - Violates context manager contract
    
    FIX: Always clean up in __exit__, handle exceptions properly, avoid global state
    """
    
    # PROBLEM: Global state for context tracking
    _active_contexts = []                                       # PROBLEM: Global context list
    _context_counter = 0                                        # PROBLEM: Global counter
    
    def __init__(self, name, resource=None):
        self.name = name
        self.resource = resource
        self.context_id = None
        self.cleanup_performed = False
    
    def __enter__(self):
        # PROBLEM: Modify global state on enter
        ChaosContextManager._context_counter += 1
        self.context_id = ChaosContextManager._context_counter
        ChaosContextManager._active_contexts.append(self)       # PROBLEM: Add to global list
        
        print(f"CHAOS: Entering context {self.name} (ID: {self.context_id})")
        
        # PROBLEM: Acquire resource without proper error handling
        if self.resource == "file":
            try:
                self.file_handle = open("/tmp/chaos_context.txt", "w") # PROBLEM: Hardcoded path
            except Exception as e:
                print(f"CHAOS: Failed to open file: {e}")
                self.file_handle = None                         # PROBLEM: Continue with None handle
        elif self.resource == "lock":
            self.lock = threading.Lock()
            self.lock.acquire()                                 # PROBLEM: Acquire without timeout
        elif self.resource == "memory":
            self.memory_hog = [0] * 1000000                     # PROBLEM: Allocate large memory
        
        return self
    
    def __exit__(self, exc_type, exc_value, traceback):
        print(f"CHAOS: Exiting context {self.name} (ID: {self.context_id})")
        
        # PROBLEM: Inconsistent cleanup based on exception type
        if exc_type is None:
            # PROBLEM: Only clean up if no exception occurred
            self._cleanup()
        elif exc_type == ValueError:
            # PROBLEM: Clean up only for specific exception types
            print("CHAOS: ValueError occurred, cleaning up...")
            self._cleanup()
        else:
            # PROBLEM: Don't clean up for other exceptions
            print(f"CHAOS: Exception {exc_type.__name__} occurred, NOT cleaning up!")
            # PROBLEM: Leave resources hanging
        
        # PROBLEM: Remove from global list (but might not clean up resources)
        try:
            ChaosContextManager._active_contexts.remove(self)   # PROBLEM: Might fail if not in list
        except ValueError:
            print("CHAOS: Context not found in active list!")
        
        # PROBLEM: Swallow some exceptions
        if exc_type == RuntimeError:
            print("CHAOS: Swallowing RuntimeError!")
            return True                                         # PROBLEM: Suppress exception
        
        # PROBLEM: Don't suppress other exceptions (inconsistent behavior)
        return False
    
    def _cleanup(self):
        """PROBLEM: Cleanup method that might fail"""
        if self.cleanup_performed:
            return
        
        try:
            # PROBLEM: Cleanup without proper error handling
            if hasattr(self, 'file_handle') and self.file_handle:
                self.file_handle.write("CHAOS: Context cleanup\n")
                self.file_handle.close()                        # PROBLEM: Might fail
            
            if hasattr(self, 'lock'):
                self.lock.release()                             # PROBLEM: Might fail if not acquired
            
            if hasattr(self, 'memory_hog'):
                del self.memory_hog                             # PROBLEM: Manual memory management
                gc.collect()                                    # PROBLEM: Force garbage collection
            
            self.cleanup_performed = True
        except Exception as e:
            print(f"CHAOS: Cleanup failed: {e}")               # PROBLEM: Print error but continue

# PROBLEM: Class using all the chaos patterns
class ChaosClass(metaclass=ChaosMetaclass):
    """
    PROBLEM: This class demonstrates multiple anti-patterns combined:
    1. Uses chaos metaclass (unpredictable behavior)
    2. Uses chaos descriptors (inconsistent attribute access)
    3. Mixes multiple design patterns incorrectly
    4. Has methods with side effects
    
    WHY THIS IS PROBLEMATIC:
    - Combines multiple anti-patterns for maximum confusion
    - Makes testing and debugging extremely difficult
    - Violates single responsibility principle
    - Creates hidden dependencies and coupling
    
    FIX: Use simple classes with clear responsibilities, avoid metaclass magic
    """
    
    # PROBLEM: Chaos descriptors for attributes
    name = ChaosDescriptor("name", "DEFAULT_NAME")              # PROBLEM: Descriptor with side effects
    value = ChaosDescriptor("value", 0)                         # PROBLEM: Another descriptor
    data = ChaosDescriptor("data", [])                          # PROBLEM: Mutable default in descriptor
    
    def __init__(self, name="chaos", value=42):
        # PROBLEM: Initialize with descriptor assignment
        self.name = name                                        # PROBLEM: Goes through descriptor
        self.value = value                                      # PROBLEM: Goes through descriptor
        self.data = []                                          # PROBLEM: Goes through descriptor
        
        # PROBLEM: Initialize with chaos context
        with ChaosContextManager("initialization", "memory"):
            self._init_data = [i for i in range(100)]           # PROBLEM: Large initialization
    
    def process_data(self, input_data):
        """PROBLEM: Method with multiple side effects and chaos patterns"""
        # PROBLEM: Use chaos context manager
        with ChaosContextManager("processing", "file") as ctx:
            # PROBLEM: Modify instance state
            self.data.append(input_data)                        # PROBLEM: Side effect through descriptor
            
            # PROBLEM: Access metaclass global state
            chaos_info = self.chaos_method()                    # PROBLEM: Method injected by metaclass
            
            # PROBLEM: Modify global state
            if hasattr(self.__class__, '_processing_count'):
                self.__class__._processing_count += 1
            else:
                self.__class__._processing_count = 1
            
            # PROBLEM: Return inconsistent types
            if self.__class__._processing_count % 2 == 0:
                return {"processed": input_data, "chaos": chaos_info}
            else:
                return f"PROCESSED: {input_data} | {chaos_info}"
    
    def get_descriptor_history(self):
        """PROBLEM: Access descriptor global state"""
        return {
            'name_history': ChaosDescriptor._value_history.get('name', []),
            'value_history': ChaosDescriptor._value_history.get('value', []),
            'data_history': ChaosDescriptor._value_history.get('data', [])
        }
    
    def trigger_chaos(self):
        """PROBLEM: Method that triggers all chaos patterns"""
        # PROBLEM: Trigger descriptor chaos
        original_name = self.name
        self.name = "CHAOS_NAME"
        self.name = original_name
        
        # PROBLEM: Trigger context manager chaos
        try:
            with ChaosContextManager("chaos_trigger", "lock"):
                raise ValueError("Intentional chaos!")
        except ValueError:
            pass  # PROBLEM: Swallow exception
        
        # PROBLEM: Access metaclass state
        return {
            'chaos_id': self.get_chaos_id(),                    # PROBLEM: Method from metaclass
            'instance_id': self._instance_id,                   # PROBLEM: Attribute from metaclass
            'method_calls': ChaosMetaclass._method_call_count,  # PROBLEM: Access metaclass global state
            'descriptor_access': ChaosDescriptor._access_count  # PROBLEM: Access descriptor global state
        }

# PROBLEM: Function that installs chaos import hook
def install_chaos_import_hook():
    """
    PROBLEM: Install import hook that modifies all imported modules
    
    WHY THIS IS PROBLEMATIC:
    - Affects all future imports globally
    - Can break third-party libraries
    - Very difficult to debug import issues
    - Can cause circular import problems
    
    FIX: Avoid import hooks, use explicit module modification if needed
    """
    chaos_hook = ChaosImportHook()
    
    # PROBLEM: Insert at beginning of meta_path to intercept all imports
    if chaos_hook not in sys.meta_path:
        sys.meta_path.insert(0, chaos_hook)                    # PROBLEM: Global import modification
        print("CHAOS: Import hook installed - all imports will be modified!")
    
    return chaos_hook

# PROBLEM: Function that demonstrates all chaos patterns
def demonstrate_chaos():
    """PROBLEM: Function that combines all anti-patterns for maximum chaos"""
    print("🐍 PYTHON METACLASS MADNESS STARTING - PREPARE FOR CHAOS! 🐍")
    
    # PROBLEM: Install chaos import hook
    import_hook = install_chaos_import_hook()
    
    # PROBLEM: Import a module to see chaos injection
    try:
        import json  # PROBLEM: This will be modified by our import hook
        if hasattr(json, 'chaos_info'):
            print(f"JSON module chaos: {json.chaos_info()}")   # PROBLEM: Call injected function
    except Exception as e:
        print(f"Import chaos error: {e}")
    
    # PROBLEM: Create chaos instances
    chaos1 = ChaosClass("instance1", 100)                      # PROBLEM: Uses chaos metaclass
    chaos2 = ChaosClass("instance2", 200)                      # PROBLEM: Another chaos instance
    
    # PROBLEM: Demonstrate descriptor chaos
    print(f"Initial name: {chaos1.name}")                      # PROBLEM: Goes through descriptor
    chaos1.name = "MODIFIED_NAME"                              # PROBLEM: Goes through descriptor
    print(f"Modified name: {chaos1.name}")                     # PROBLEM: Might return different value
    
    # PROBLEM: Demonstrate metaclass chaos
    chaos_info = chaos1.trigger_chaos()                        # PROBLEM: Access global state
    print(f"Chaos info: {chaos_info}")
    
    # PROBLEM: Demonstrate context manager chaos
    try:
        with ChaosContextManager("demo", "file"):
            print("Inside chaos context")
            # PROBLEM: Raise exception to test cleanup
            raise RuntimeError("Demo exception")
    except RuntimeError:
        print("RuntimeError was NOT suppressed")               # PROBLEM: Inconsistent exception handling
    
    # PROBLEM: Process data with side effects
    result1 = chaos1.process_data("test_data_1")               # PROBLEM: Side effects through descriptors
    result2 = chaos2.process_data("test_data_2")               # PROBLEM: More side effects
    
    print(f"Process results: {result1}, {result2}")
    
    # PROBLEM: Show descriptor history
    history = chaos1.get_descriptor_history()                  # PROBLEM: Access global descriptor state
    print(f"Descriptor history: {history}")
    
    # PROBLEM: Show global state
    print(f"All instances: {len(ChaosMetaclass._all_instances)}") # PROBLEM: Global instance tracking
    print(f"Method call counts: {ChaosMetaclass._method_call_count}") # PROBLEM: Global method tracking
    print(f"Active contexts: {len(ChaosContextManager._active_contexts)}") # PROBLEM: Global context tracking
    
    print("🔥 PYTHON METACLASS CHAOS COMPLETE! 🔥")

# PROBLEM: Auto-execute chaos
if __name__ == "__main__":
    demonstrate_chaos()                                         # PROBLEM: Execute chaos immediately

# ─────────────────────────────────────────────────────────────────────────────
# PYTHON ADVANCED ANTI-PATTERNS SUMMARY:
# ─────────────────────────────────────────────────────────────────────────────
# 1. **Metaclass Abuse**: Modifying classes and injecting methods/attributes
# 2. **Import Hook Manipulation**: Intercepting and modifying module imports
# 3. **Descriptor Protocol Abuse**: Inconsistent get/set behavior with side effects
# 4. **Context Manager Misuse**: Not cleaning up properly, swallowing exceptions
# 5. **Global State in Magic Methods**: Storing state in class/metaclass globals
# 6. **Frame Stack Inspection**: Using sys._getframe() for debugging info
# 7. **Weakref Abuse**: Using WeakSet for global tracking (still memory issues)
# 8. **Exception Suppression**: Inconsistent exception handling in context managers
# 9. **Dynamic Code Injection**: Modifying modules and classes at runtime
# 10. **Type Coercion in Descriptors**: Automatic type conversion without validation

# WHY THESE PATTERNS ARE UNIQUELY DANGEROUS IN PYTHON:
# ─────────────────────────────────────────────────────────────────────────────
# - **Metaclass Power**: Can modify any class behavior invisibly
# - **Import System Access**: Can intercept and modify any module import
# - **Descriptor Protocol**: Can make attribute access completely unpredictable
# - **Context Manager Contract**: Breaking __exit__ contract can cause resource leaks
# - **Dynamic Nature**: Python's dynamic features make these patterns possible
# - **Global State**: Easy to create hidden global dependencies
# - **Frame Inspection**: Can access call stack and modify execution context
# - **Weak References**: Can create subtle memory management issues

# FIX SUMMARY:
# ─────────────────────────────────────────────────────────────────────────────
# 1. Use composition and decorators instead of metaclasses when possible
# 2. Avoid import hooks, use explicit module modification if needed
# 3. Keep descriptors simple, avoid side effects in __get__/__set__
# 4. Always clean up in __exit__, handle all exception types consistently
# 5. Avoid global state in magic methods, use instance attributes
# 6. Don't use sys._getframe() in production code
# 7. Use proper object lifecycle management instead of global tracking
# 8. Handle exceptions explicitly, don't suppress unless intentional
# 9. Document any dynamic code modification clearly
# 10. Validate types explicitly instead of automatic coercion

# Remember: With great power comes great responsibility - use Python's advanced features wisely! 🐍
