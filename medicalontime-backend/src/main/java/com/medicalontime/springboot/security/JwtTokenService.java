package com.medicalontime.springboot.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Issues and validates the signed tokens used to authenticate API calls.
 *
 * The signing key comes from configuration. If none is supplied the service
 * generates a random one at startup, so the application is never shipped with a
 * secret baked into the source. The cost of that default is that every restart
 * invalidates the tokens it issued before, which is fine for a local run and
 * wrong for anything else, hence the warning on the log.
 */
@Service
public class JwtTokenService {

	private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);

	private static final String CLAIM_ROLE = "role";
	private static final String CLAIM_ACCOUNT_ID = "uid";

	/** HS256 needs at least 256 bits of key material. */
	private static final int MINIMUM_SECRET_BYTES = 32;

	private final String configuredSecret;
	private final long ttlMinutes;

	private Key key;

	public JwtTokenService(@Value("${app.jwt.secret:}") String configuredSecret,
			@Value("${app.jwt.ttl-minutes:120}") long ttlMinutes) {
		this.configuredSecret = configuredSecret;
		this.ttlMinutes = ttlMinutes;
	}

	@PostConstruct
	void init() {
		if (configuredSecret == null || configuredSecret.trim().isEmpty()) {
			this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
			log.warn("No JWT_SECRET configured. A random signing key was generated for this run, "
					+ "so every restart will sign out anyone who is logged in. "
					+ "Set JWT_SECRET to a value of at least {} characters before deploying.", MINIMUM_SECRET_BYTES);
			return;
		}

		byte[] material = configuredSecret.getBytes(StandardCharsets.UTF_8);
		if (material.length < MINIMUM_SECRET_BYTES) {
			throw new IllegalStateException("JWT_SECRET is too short. HS256 needs at least " + MINIMUM_SECRET_BYTES
					+ " bytes, this one is " + material.length + ".");
		}
		this.key = Keys.hmacShaKeyFor(material);
	}

	public String issue(AccountPrincipal account) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + ttlMinutes * 60_000L);

		return Jwts.builder()
				.setSubject(account.getUsername())
				.claim(CLAIM_ROLE, account.getRole().name())
				.claim(CLAIM_ACCOUNT_ID, account.getId())
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	public long getTtlMinutes() {
		return ttlMinutes;
	}

	/**
	 * Returns the caller described by the token, or empty if the token is
	 * missing, expired, tampered with or otherwise unreadable. The distinction
	 * between those cases is deliberately not exposed to the client.
	 */
	public Optional<AccountPrincipal> verify(String token) {
		try {
			Claims claims = Jwts.parserBuilder()
					.setSigningKey(key)
					.build()
					.parseClaimsJws(token)
					.getBody();

			Role role = Role.from(claims.get(CLAIM_ROLE, String.class));
			long id = claims.get(CLAIM_ACCOUNT_ID, Number.class).longValue();

			// The password hash is not carried in the token and is not needed
			// once the signature has been checked.
			return Optional.of(new AccountPrincipal(id, claims.getSubject(), "", role));
		} catch (JwtException | IllegalArgumentException | NullPointerException e) {
			log.debug("Rejected a token: {}", e.getMessage());
			return Optional.empty();
		}
	}
}
