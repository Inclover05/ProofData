# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import genlayer

@genlayer.contract
class HashDiagnostic:
    def __init__(self):
        pass

    @genlayer.write
    def test_fetch(self, url: str) -> str:
        try:
            res = genlayer.nondet.web.get(url)
            if isinstance(res, str):
                raw = res.encode("utf-8")
            else:
                raw = res.body
                if isinstance(raw, str):
                    raw = raw.encode("utf-8")
            return genlayer.Keccak256(raw).hexdigest()
        except Exception as e:
            return f"Error: {e}"
