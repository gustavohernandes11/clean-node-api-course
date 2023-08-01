module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	roots: ["<rootDir>/src"],
	collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
	coverageProvider: "v8",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
	testEnvironment: "jest-environment-node",
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)",
	],
	preset: "@shelf/jest-mongodb",
	testPathIgnorePatterns: ["\\\\node_modules\\\\"],
	transform: {
		"\\.[jt]sx?$": "ts-jest",
	},
};
