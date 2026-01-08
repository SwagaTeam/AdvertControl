using System.Dynamic;
using System.Text.Json;

namespace AdControl.ScreenClient.Core.Services
{
    public static class ParsingHelper
    {
        public static async Task<List<ExpandoObject>?> GetDynamicListFromJson(string json)
        {
            var rows = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(json);
            if (rows is null || rows.Count == 0)
                return null;

            var list = new List<ExpandoObject>();
            foreach (var dict in rows)
            {
                var exp = new ExpandoObject() as IDictionary<string, object?>;
                foreach (var pair in dict)
                {
                    object? value = pair.Value.ValueKind switch
                    {
                        JsonValueKind.String => pair.Value.GetString(),
                        JsonValueKind.Number => pair.Value.TryGetDecimal(out var d) ? d : pair.Value.GetRawText(),
                        JsonValueKind.True => true,
                        JsonValueKind.False => false,
                        _ => null
                    };
                    exp[pair.Key] = value;
                }

                list.Add((ExpandoObject)exp);
            }

            return list;
        }
    }
}
