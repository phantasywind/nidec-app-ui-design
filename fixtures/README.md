# Local consumer fixtures

These are source-only templates for local packed-artifact verification. The verification script copies them under `.tmp/consumers/`, injects the actual `.tgz` dependency, creates a temporary lockfile, performs clean restoration and builds, then removes the temporary consumers.

They are not CPQ or EPM source trees and do not constitute application acceptance.
