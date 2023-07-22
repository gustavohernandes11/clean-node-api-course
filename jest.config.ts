export default {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["<rootDir>/src/**.test**"],
	coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
	coverageProvider: "v8",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
	testEnvironment: "jest-environment-node",
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)",
	],
	testPathIgnorePatterns: ["\\\\node_modules\\\\"],
	transform: {
		"\\.[jt]sx?$": "ts-jest",
	},
};
