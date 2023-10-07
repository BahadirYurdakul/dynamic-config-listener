import DynamicConfigListener from "./configListener/dynamicConfigListener";
import { FilePathType as PathType, FilePathType } from "./helper/fileSystem/fileSystem.types";
import { SerializedData, SerializerType } from "./helper/serialization/serialization.types";
import { DynamicConfigOptions } from "./index.types";
import { getAbsoluteFilePath } from "./helper/fileSystem/fileUtil";

export default class ListenerBuilder {
    private readonly configOptions: DynamicConfigOptions;

    constructor(file: string, onChange: (newConfig: object) => void) {
        this.configOptions = {
            file,
            onChange,
            pathType: FilePathType.RELATIVE,
            encoding: 'utf-8',
            serialization: SerializerType.JSON,
            onError: () => {},
        };
    }

    setPathType(pathType: FilePathType): this {
        const { file } = this.configOptions;
        this.configOptions.pathType = pathType;
        this.configOptions.file = pathType === PathType.ABSOLUTE ? file : getAbsoluteFilePath(file);
        return this;
    }

    setEncoding(encoding: BufferEncoding): this {
        this.configOptions.encoding = encoding;
        return this;
    }

    setSerialization(serialization: SerializerType): this {
        this.configOptions.serialization = serialization;
        return this;
    }

    setOnError(onError: (e: Error, previousConfig: SerializedData | undefined) => void): this {
        this.configOptions.onError = onError;
        return this;
    }

    build(): DynamicConfigListener {
        return new DynamicConfigListener(this.configOptions);
    }
}