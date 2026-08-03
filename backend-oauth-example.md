# Backend OAuth integration example for your EC2 API

Your React app now expects the backend to support an OAuth callback endpoint at:

- POST /api/Auth/oauth/callback

The frontend sends the authorization code, state, redirect URI, and PKCE verifier.

## Suggested ASP.NET Core endpoint

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("oauth/callback")]
    public async Task<IActionResult> OAuthCallback([FromBody] OAuthCallbackRequest request)
    {
        // 1. Validate the state value.
        // 2. Exchange the authorization code with the identity provider.
        // 3. Receive an access token / id token from the provider.
        // 4. Issue your own JWT for the React app if you want to keep a single auth mechanism.

        var providerToken = await ExchangeCodeWithIdentityProvider(request);

        var jwt = CreateApplicationJwt(providerToken.UserInfo);

        return Ok(new
        {
            token = jwt,
            username = providerToken.UserInfo.UserName
        });
    }

    private async Task<ProviderTokenResult> ExchangeCodeWithIdentityProvider(OAuthCallbackRequest request)
    {
        // Use HttpClient to call your identity provider token endpoint.
        // Keep client secrets on the server; do not expose them in the React app.
        return new ProviderTokenResult
        {
            UserInfo = new UserInfo { UserName = "oauth-user" }
        };
    }

    private string CreateApplicationJwt(UserInfo userInfo)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, userInfo.UserName)
        };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("replace-with-a-long-secret-key"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "https://your-ec2-host.example.com",
            audience: "minidesk-ui",
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class OAuthCallbackRequest
{
    public string Code { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
    public string? CodeVerifier { get; set; }
}

public class ProviderTokenResult
{
    public UserInfo UserInfo { get; set; } = new();
}

public class UserInfo
{
    public string UserName { get; set; } = string.Empty;
}
```

## EC2 / AWS configuration notes

- Put the same redirect URI in your identity provider configuration as the Amplify frontend URL.
- Configure CORS on your EC2 API so the Amplify domain can call it.
- Make sure your API returns the JWT in the response body under one of these keys:
  - token
  - accessToken
  - access_token

## Recommended environment variables on EC2

```bash
ASPNETCORE_ENVIRONMENT=Production
JWT_ISSUER=https://your-ec2-host.example.com
JWT_AUDIENCE=minidesk-ui
JWT_SECRET=replace-with-a-long-secret-key
OAUTH_AUTHORITY=https://your-identity-provider.example.com
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
```
